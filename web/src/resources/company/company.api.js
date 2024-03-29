import { useMutation, useQuery } from 'react-query';

import queryClient from 'query-client';
import { apiService } from 'services';

const resource = '/companies';

export function useInviteMember() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.currentCompany._id;
  const inviteMember = (data) => apiService.post(`${resource}/${companyId}/invitations`, data);

  return useMutation(inviteMember, {
    onSuccess() {
      queryClient.invalidateQueries(['companyMembers']);
    },
  });
}

export function useCancelInvitation() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.currentCompany._id;
  const cancelInvitation = (data) => apiService.delete(`${resource}/${companyId}/invitations`, data);

  return useMutation(cancelInvitation, {
    onSuccess() {
      queryClient.invalidateQueries(['companyMembers']);
    },
  });
}

export function useRemoveMember() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.currentCompany._id;
  const removeMember = ({ _id }) => apiService.delete(`${resource}/${companyId}/members/${_id}`);

  return useMutation(removeMember, {
    onSuccess() {
      queryClient.invalidateQueries(['companyMembers']);
    },
  });
}

export function useGetMembers() {
  const admin = queryClient.getQueryData(['currentAdmin']);
  const companyId = admin.currentCompany._id;
  const getMembers = () => apiService.get(`${resource}/${companyId}/members`);

  return useQuery(['companyMembers'], getMembers);
}

export function useChangeMemberPermissions(companyId) {
  const changePermissions = ({ memberId, enabledPermissions }) => apiService.put(
    `${resource}/${companyId}/members/${memberId}/permissions`,
    { enabledPermissions },
  );

  return useMutation(changePermissions, {
    onSuccess: () => {
      queryClient.invalidateQueries(['companyMembers']);
    },
  });
}

export function useChangeName(companyId) {
  const changeName = (name) => apiService.put(`${resource}/${companyId}/name`, { name });
  const currentAdmin = queryClient.getQueryData(['currentAdmin']);
  return useMutation(changeName, {
    onSuccess: (data) => {
      const updatedAdmin = { ...currentAdmin };
      updatedAdmin.currentCompany.name = data.name;
      updatedAdmin.companies = updatedAdmin.companies.map((c) => {
        if (c._id === updatedAdmin.currentCompany._id) {
          return { ...c, name: data.name };
        }
        return c;
      });

      queryClient.setQueryData(['currentAdmin'], () => ({ ...updatedAdmin }));
    },
  });
}
