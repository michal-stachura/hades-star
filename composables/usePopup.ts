const usePopup = () => {
  const isPopupVisible = useState<boolean>('popup', () => false)

  const popupToggleVisibility = () => {
    isPopupVisible.value = !isPopupVisible.value
  }

  return {
    isPopupVisible,
    popupToggleVisibility
  }
}

export default usePopup;