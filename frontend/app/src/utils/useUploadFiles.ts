import {useEffect, useState} from "react";
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


	useEffect(() => {
		let uploadInterval: any = null;
		uploadInterval = setInterval(() => {
			// If there are no files to upload
			if (queue.length === 0) {
				clearInterval(uploadInterval);
				return;
			}

			// If there is already a file busy uploading
			if (queue.find(f => f.state === UploadState.LOADING)) {
				return false;
			}

			const nextFile = queue.find(f => f.state === UploadState.QUEUED);
			if (!nextFile) {
				clearInterval(uploadInterval);
				onDone();
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

			uploadJob.then(u => {
				setQueue(q => {
					return q.map(f => {
						if (f.file.name === nextFile.file.name) {
							f.state = UploadState.DONE;
						}
						return f;
					});
				});
			});
		}, 500);

		return () => {
			clearInterval(uploadInterval);
		};
	}, [doUpload, onDone, queue]);

	return [
		queue,
		{addFiles},
	];
};

export default useUploadFiles;