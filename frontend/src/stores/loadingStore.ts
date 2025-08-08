import { atom } from 'nanostores';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Global loading state
export const loadingStore = atom<LoadingState>({
  isLoading: false,
  message: undefined,
  size: 'md'
});

// Actions to control loading state
export const showLoading = (message?: string, size?: 'sm' | 'md' | 'lg') => {
  loadingStore.set({
    isLoading: true,
    message,
    size: size || 'md'
  });
};

export const hideLoading = () => {
  loadingStore.set({
    isLoading: false,
    message: undefined,
    size: 'md'
  });
};

// Helper hook for React components
export const useGlobalLoading = () => {
  return {
    showLoading,
    hideLoading
  };
};