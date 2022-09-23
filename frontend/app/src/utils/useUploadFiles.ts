import {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {FileUpload, UploadState} from "../models/models";

type DoUploadFunction = (file: FileUpload) => Promise<boolean>;
type UseUploadFilesOptions = {
	doUpload: DoUploadFunction,
	onDone: VoidFunction,
};
type UseUploadFiles = [
	FileUpload[],
	{
		addFiles: (files: FileList) => void
	}
];

const useUploadFiles: (options: UseUploadFilesOptions) => UseUploadFiles = ({doUpload, onDone}): UseUploadFiles => {
	const {t} = useTranslation();
	const [queue, setQueue] = useState<FileUpload[]>([]);
	const addFiles = (files: FileList) => {
		const filesArray = Array.from(files);
		const newFiles = filesArray.map(f => ({
			file: f,
			loading: false,
			state: UploadState.QUEUED,
		}));
		setQueue(f => [...f, ...newFiles]);
	};

	const getNextFromQueue = useCallback(() => {
		return queue.find(f => f.state === UploadState.QUEUED);
	}, [queue]);

	useEffect(() => {
		const uploadInterval = setInterval(() => {
			const nextFile = getNextFromQueue();
			// If there are no files to upload
			if (!nextFile || queue.length === 0) {
				clearInterval(uploadInterval);
				return;
			}

			// If there is already a file busy uploading
			if (queue.find(f => f.state === UploadState.LOADING)) {
				return;
			}

			setQueue(q => {
				return q.map(f => {
					if (f.file.name === nextFile.file.name) {
						f.state = UploadState.LOADING;
					}
					return f;
				});
			});

			const uploadJob: Promise<boolean> = doUpload(nextFile);

			uploadJob.then(() => {
				setQueue(q => {
					return q.map(f => {
						if (f.file.name === nextFile.file.name) {
							f.state = UploadState.DONE;
						}
						return f;
					});
				});
			}).catch(err => {
				setQueue(q => {
					return q.map(f => {
						if (f.file.name === nextFile.file.name) {
							f.state = UploadState.DONE;
							f.error = err;
							if (err.message.includes("format")) {
								f.error = {...err, message: t("messages.upload.formatError")};
							}
						}
						return f;
					});
				});
			}).finally(() => {
				const nextFile = getNextFromQueue();
				if (!nextFile) {
					onDone();
				}
			});
		}, 500);

		return () => {
			clearInterval(uploadInterval);
		};
	}, [doUpload, onDone, queue, t, getNextFromQueue]);

	return [
		queue,
		{addFiles},
	];
};

export default useUploadFiles;
