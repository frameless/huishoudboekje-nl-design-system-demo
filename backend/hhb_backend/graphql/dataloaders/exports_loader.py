from hhb_backend.graphql.dataloaders.base_loader import DataLoader


class ExportByIdLoader(DataLoader):
    """ Load exports using ids """
    model = "export"

    def get_by_timestamps(self, start_datum, eind_datum):
        return self.load_all(params={
            'start_datum': start_datum,
            'eind_datum': eind_datum
        })
