import Swal from "sweetalert2";

const primaryColor = "#245a47";
const dangerColor = "#b44343";
const cancelColor = "#8a918d";

export function showSuccess(title, text = "") {
  return Swal.fire({
    icon: "success",
    title,
    text,
    showConfirmButton: false,
    timer: 1300,
    timerProgressBar: true,
  });
}

export function showError(title, text) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "Tutup",
    confirmButtonColor: primaryColor,
  });
}

export function showWarning(title, text) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    confirmButtonText: "Mengerti",
    confirmButtonColor: primaryColor,
  });
}

export function showConfirm({
  title,
  text,
  html,
  confirmText = "Ya, lanjutkan",
  danger = false,
}) {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    html,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: danger ? dangerColor : primaryColor,
    cancelButtonColor: cancelColor,
    reverseButtons: true,
  });
}

export function showTextInput({
  title,
  text,
  value = "",
  placeholder = "",
  confirmText = "Simpan",
}) {
  return Swal.fire({
    title,
    text,
    input: "text",
    inputValue: value,
    inputPlaceholder: placeholder,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: "Batal",
    confirmButtonColor: primaryColor,
    cancelButtonColor: cancelColor,
    reverseButtons: true,
    inputValidator: (inputValue) => {
      const trimmedValue = inputValue.trim();

      if (!trimmedValue) {
        return "Nama kategori wajib diisi";
      }

      if (trimmedValue.length < 3) {
        return "Nama kategori minimal 3 karakter";
      }

      return undefined;
    },
  });
}

export function getErrorMessage(
  error,
  fallback = "Terjadi kesalahan pada sistem.",
) {
  return error.response?.data?.message || fallback;
}
