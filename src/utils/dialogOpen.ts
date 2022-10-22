import { getElement } from "../biz/elements";
import { GlobalImport } from "./GlobalImport";

export type DIALOG_IDS = "completeDialog";
export function dialogOpen(dialog_id: DIALOG_IDS) {
  const bootstrap = GlobalImport.getBootstrap();
  const modalDialog = new bootstrap.Modal(document.getElementById(dialog_id), {
    keyboard: false,
  });
  modalDialog.toggle();
}

export function onOpenCompleteDialog(callback: (event: Event) => void) {
  const dialog = getElement("completeDialog");
  dialog.addEventListener("show.bs.modal", callback);
}
