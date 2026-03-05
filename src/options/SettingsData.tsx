import ExportDialog from '~/components/ExportDialog';
import ImportDialog from '~/components/ImportDialog';

const SettingsData = () => {
  return (
    <div className="mt-4">
      <h2 className="border-t pb-4 pt-2 text-xl font-semibold">
        Settings Data Management
      </h2>
      <div className="mt -4 flex justify-center gap-6">
        <ExportDialog />
        <ImportDialog />
      </div>
    </div>
  );
};

export default SettingsData;
