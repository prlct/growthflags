import { useMutation, useQuery } from 'react-query';
import queryClient from 'query-client';
import { apiService } from 'services';
import { showNotification } from '@mantine/notifications';

const pipelinesResource = '/pipelines';
const sequencesResource = '/sequences';
const sequenceEmailResource = '/sequence-emails';
const pipelineUsersResource = '/pipeline-users';

export const useGetPipelines = (env) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;
  const getPipelines = async () => apiService.get(pipelinesResource, { env, applicationId });

  return useQuery([pipelinesResource, env], getPipelines);
};

export function useAddPipeline(env) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const data = queryClient.getQueryData([pipelinesResource, env]);

  const currentPipelines = data?.results || [];

  const createEmptyPipeline = async () => apiService.post(
    `/applications/${applicationId}/pipelines`,
    { name: `Pipeline ${currentPipelines.length + 1}`, env, applicationId },
  );

  return useMutation(createEmptyPipeline, {
    onSuccess: () => {
      showNotification({
        title: 'Pipeline added',
        message: 'New pipeline added',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useRemovePipeline() {
  const removePipeline = async (id) => apiService.delete(
    `${pipelinesResource}/${id}`,
  );

  return useMutation(removePipeline, {
    onSuccess: () => {
      showNotification({
        title: 'Pipeline removed',
        message: 'Pipeline removed',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useUpdatePipeline() {
  const updatePipeline = ({ _id, name }) => apiService.put(`/pipelines/${_id}`, { name });

  return useMutation(updatePipeline, {
    onSuccess: () => {
      showNotification({
        title: 'Pipeline updated',
        message: 'Pipeline updated',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelinesResource]);
    },
  });
}

export function useGetSequences(pipelineId) {
  const getSequences = async () => apiService.get(sequencesResource, { pipelineId });

  return useQuery([sequencesResource], getSequences);
}

export function useAddSequence(pipelineId) {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const addSequence = async ({ name, trigger = null, env }) => apiService.post(
    `/applications/${applicationId}/sequences`,
    { name, pipelineId, trigger, env },
  );

  return useMutation(addSequence, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence created',
        message: 'New sequence created',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useUpdateSequence() {
  const updateSequences = ({ _id, name }) => apiService.put(`${sequencesResource}/${_id}`, { name });

  return useMutation(updateSequences, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence updated',
        message: 'Sequence successfully updated',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useRemoveSequence() {
  const removeSequence = async (id) => apiService.delete(
    `${sequencesResource}/${id}`,
  );

  return useMutation(removeSequence, {
    onSuccess: () => {
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useToggleSequenceEnabled() {
  const toggleSequence = async (id) => apiService.put(`${sequencesResource}/${id}/toggle-enabled`);

  return useMutation(toggleSequence, {
    onSuccess: () => {
      queryClient.invalidateQueries([sequencesResource]);
    },
    onError: (err) => {
      showNotification({
        title: 'Toggle sequence enabled failed',
        message: err?.data?.errors.sequence,
        color: 'red',
      });
    },
  });
}

export function useUpdateSequenceTrigger(id) {
  const updateTrigger = (data) => apiService.put(`${sequencesResource}/${id}/trigger`, data);

  return useMutation(updateTrigger, {
    onSuccess: () => {
      showNotification({
        title: 'Sequence trigger updated',
        message: 'Sequence trigger successfully updated',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
  });
}

export function useGetSequenceEmails(sequenceId) {
  const getEmails = async () => apiService.get(sequenceEmailResource, { sequenceId });

  return useQuery([`${sequenceEmailResource}-${sequenceId}`], getEmails);
}

export function useEmailUpdate(emailId) {
  const updateEmail = async (data) => apiService.put(`${sequenceEmailResource}/${emailId}`, data);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email updated',
        message: 'Sequence email updated',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailCreate() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;
  const updateEmail = async (data) => apiService.post(`/applications/${applicationId}${sequenceEmailResource}`, data);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email created',
        message: 'Sequence email created',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailToggle(emailId) {
  const updateEmail = async () => apiService.put(`${sequenceEmailResource}/${emailId}/toggle`);

  return useMutation(updateEmail, {
    onSuccess: (item) => {
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useEmailRemove(emailId) {
  const removeEmail = async () => apiService.delete(`${sequenceEmailResource}/${emailId}`);

  return useMutation(removeEmail, {
    onSuccess: (item) => {
      showNotification({
        title: 'Sequence email removed',
        message: 'Sequence email removed',
        color: 'green',
      });
      queryClient.invalidateQueries([`${sequenceEmailResource}-${item.sequenceId}`]);
    },
  });
}

export function useGetUsers() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const getUsers = () => apiService.get(`${pipelineUsersResource}`, { applicationId });

  return useQuery([pipelineUsersResource], getUsers);
}

export function useAddUsersList() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const addUsersList = ({ usersList, sequenceId }) => apiService.post(
    `/applications/${applicationId}/pipeline-users-list`,
    { usersList, sequenceId },
  );

  return useMutation(addUsersList, {
    onSuccess: () => {
      showNotification({
        title: 'Added users to sequence',
        message: 'Added users to sequence',
        color: 'green',
      });
      queryClient.invalidateQueries([sequencesResource]);
    },
    onError() {
      showNotification({
        title: 'User already in an active pipeline',
        message: 'User already in an active pipeline',
        color: 'red',
      });
    },
  });
}

export function useAddPipelinesToUser() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const addPipelinesList = ({ pipelineIds, userId }) => apiService.post(
    `/applications/${applicationId}/pipelines-to-user`,
    { pipelineIds, userId },
  );

  return useMutation(addPipelinesList, {
    onSuccess: () => {
      queryClient.invalidateQueries([pipelineUsersResource]);
    },
    onError() {
      showNotification({
        title: 'Error',
        message: 'Error',
        color: 'red',
      });
    },
  });
}

export const useUpdateUser = (userId) => {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const updateUser = async (data) => apiService.put(
    `${pipelineUsersResource}/${userId}`,
    { ...data, applicationId },
  );

  return useMutation(updateUser, {
    onSuccess: () => {
      showNotification({
        title: 'Subscriber updated',
        message: 'Subscriber updated',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelineUsersResource]);
    },
  });
};

export function useRemoveUser() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const removeUser = (userId) => apiService.delete(
    `${pipelineUsersResource}/${userId}`,
    { applicationId },
  );

  return useMutation(removeUser, {
    onSuccess: () => {
      showNotification({
        title: 'Removed user from sequence',
        message: 'Removed user from sequence',
        color: 'green',
      });
      queryClient.invalidateQueries([pipelineUsersResource]);
    },
    onError() {
      showNotification({
        title: 'Users already in an active pipeline',
        message: 'Users already in an active pipeline',
        color: 'red',
      });
    },
  });
}

export function useGetApplicationEvents() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const getEvents = () => apiService.get(`/applications/${applicationId}/events`);

  return useQuery(['pipeline-events'], getEvents);
}

export function useDeleteEvent() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const deleteFeature = (event) => apiService.delete(`/applications/${applicationId}/events`, event);
  return useMutation(deleteFeature, {
    onSuccess: () => {
      queryClient.invalidateQueries(['pipeline-events']);
    },
  });
}

export function useAddApplicationEvent() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const addEvent = (event) => apiService.post(`/applications/${applicationId}/events`, event);

  return useMutation(addEvent, {
    onSuccess: () => {
      showNotification({
        title: 'Created new event',
        message: 'Created new event',
        color: 'green',
      });
      queryClient.invalidateQueries(['pipeline-events']);
    },
    onError: () => {
      showNotification({
        title: 'Error',
        message: 'Event name and key must be unique',
        color: 'red',
      });
    },
  });
}

export function useUpdateApplicationEvent() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const updateEvent = ({ updatedEvent, event }) => apiService.put(`/applications/${applicationId}/events`, { updatedEvent, event });

  return useMutation(updateEvent, {
    onSuccess: () => {
      showNotification({
        title: 'Update',
        message: 'Event was updated',
        color: 'green',
      });
      queryClient.invalidateQueries(['pipeline-events']);
    },
    onError: () => {
      showNotification({
        title: 'Error',
        message: 'Event name and key must be unique',
        color: 'red',
      });
    },
  });
}

export function useSendTestEmail(id) {
  const sendEmail = (email) => apiService.post(`${sequenceEmailResource}/${id}/send-test-email`, { email });

  return useMutation(sendEmail, {
    onSuccess: () => {
      showNotification({
        title: 'Test email was sent.',
        message: 'Test email was sent.',
        color: 'green',
      });
    },
  });
}

export function useGetSenderEmails() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const getSenderEmails = () => apiService.get(`/applications/${applicationId}/sender-emails`);

  return useQuery(['sender-emails'], getSenderEmails);
}

export function useRemoveSenderEmail() {
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  const applicationId = currentAdmin.currentApplicationId;

  const removeSenderEmail = (email) => apiService.delete(`/applications/${applicationId}/sender-emails`, { email });

  return useMutation(removeSenderEmail, {
    onSuccess: () => {
      queryClient.invalidateQueries(['sender-emails']);
    },
  });
}

export function useGetUnsubscribeTokenInfo(token) {
  const getInfo = () => apiService.get(`${sequencesResource}/get-unsubscribe-info/${token}`);

  return useQuery(['unsubscribe-token', token], getInfo);
}

export function useUnsubscribe(token) {
  const unsub = () => apiService.get(`${sequencesResource}/unsubscribe/${token}`);

  return useMutation(unsub, {
    onSuccess: () => {
      showNotification({
        title: "You've successfully unsubscribed",
        message: "You've successfully unsubscribed",
        color: 'green',
      });
    },
  });
}
