import { apiSlice } from "../apiSlice";

const notificationEndpoints = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    addDeviceNoty: build.mutation<object, NotifyInput>({
      query: (body) => ({
        url: "/notifications/add-device",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useAddDeviceNotyMutation } = notificationEndpoints;

interface NotifyInput {
  deviceToken: string;
  device: string;
}
