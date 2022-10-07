import { getElement } from "./elements";
import { GlobalImport } from "./GlobalImport";

export type DIALOG_IDS = "descriptionDialog";
export function dialogOpen(dialog_id: DIALOG_IDS) {
  const bootstrap = GlobalImport.getBootstrap();
  const modalDialog = new bootstrap.Modal(document.getElementById(dialog_id));
  modalDialog.toggle();
}

export function onOpenDescriptionDialog(callback: (event: Event) => void) {
  const dialog = getElement("test");
  dialog.addEventListener("show.bs.modal", callback);
}
