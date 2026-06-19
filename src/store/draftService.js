import localforage from 'localforage';

localforage.config({
  name: 'MoryTory',
  storeName: 'draft_store',
});

const DRAFT_KEY = 'current_design_draft';

export const saveDraft = async (state) => {
  try {
    const draftData = {
      isPrintingPhoto: state.isPrintingPhoto,
      frameSize: state.frameSize,
      selectedAREffect: state.selectedAREffect,
      overlay: state.overlay,
      pricing: state.pricing,
    };
    
    // Convert File to ArrayBuffer for storage
    if (state.photo) {
      const buffer = await state.photo.arrayBuffer();
      draftData.photoData = {
        buffer,
        type: state.photo.type,
        name: state.photo.name
      };
    }

    await localforage.setItem(DRAFT_KEY, draftData);
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};

export const loadDraft = async () => {
  try {
    const draftData = await localforage.getItem(DRAFT_KEY);
    if (!draftData) return null;

    const restoredState = {
      isPrintingPhoto: draftData.isPrintingPhoto,
      frameSize: draftData.frameSize,
      selectedAREffect: draftData.selectedAREffect,
      overlay: draftData.overlay,
      pricing: draftData.pricing,
      photo: null,
      photoPreviewUrl: null
    };

    if (draftData.photoData) {
      const blob = new Blob([draftData.photoData.buffer], { type: draftData.photoData.type });
      // To create a File object we can use the Blob constructor
      const file = new File([blob], draftData.photoData.name, { type: draftData.photoData.type });
      restoredState.photo = file;
      restoredState.photoPreviewUrl = URL.createObjectURL(file);
    }

    return restoredState;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
};

export const clearDraft = async () => {
  try {
    await localforage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
};
