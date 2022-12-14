import { useMutation, useQuery } from 'react-query';
import { apiService } from 'services';

export function useGetCurrent() {
  const getCurrent = () => apiService.get('/subscriptions/current');

  return useQuery(['currentSubscription'], getCurrent);
}

export const useSubscribe = () => {
  const subscribe = ({ priceId, interval }) => apiService.post('subscriptions/subscribe', { priceId, interval });

  return useMutation(subscribe, {
    onSuccess: (data) => {
      window.location.href = data.checkoutLink;
    },
  });
};

export const usePreviewUpgradeSubscription = (priceId) => {
  const preview = () => apiService.get('/subscriptions/preview-upgrade', { priceId });

  return useQuery(['previewUpgrade'], preview);
};

export const useUpgradeSubscription = () => {
  const upgrade = ({ priceId }) => apiService.post('subscriptions/upgrade-subscription', { priceId });

  return useMutation(upgrade, {
    onSuccess: (data) => {
      console.clear();
      console.log(data);
    },
  });
};

export const useCancelMutation = () => {
  const cancel = () => apiService.post('subscriptions/cancel-subscription');

  return useMutation(cancel);
};
