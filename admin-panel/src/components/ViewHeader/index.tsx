import BackButton from "../Buttons/BackButton";
import EditButton from "../Buttons/EditButton";
import DeleteButton from "../Buttons/DeleteButton";

interface ViewHeaderProps {
  onBack: {
    to: string;
    label: string;
  }
  onEdit: {
    to: string;
    label: string;
  }
  onDelete: {
    action: () => void;
    label: string;
  }
}

export default function ViewHeader({ onBack, onEdit, onDelete }: ViewHeaderProps) {
  return (

    <div className="flex items-center justify-between mb-8" >
      <BackButton to={{ pathname: onBack.to }} label={onBack.label} />

      <div className="flex items-center gap-4 text-sm">
        <EditButton to={{ pathname: onEdit.to }} title={onEdit.label} />
        <DeleteButton onDelete={onDelete.action} title={onDelete.label} />
      </div>
    </div >
  )
}