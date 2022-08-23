---
sidebar_position: 3
---

# REST API endpoints

## feature-flags.fix-domain/feature-flags/{applicationId?}

Allows you to get data about feature flags

### Arguments

- `apiKey` - Your application public API key. **Required**
- `env` - Application environment. **Required**
- `userId` - Unique user identifier. **Optional**

### Response

Object with two fields `featureFlags` and `configurations`. ...

```
{
  featureFlags: {
    RedesignedVideoPlayer: true,
    SecurityEmailNotifications: true,
    DarkMode: true,
  },
  configurations: {
    RedesignedVideoPlayer: {
      "buttonColor": "red",
      "defaultSound": "unmuted" ,
      "fontSize": "md"
    },
  },
};
```

### Example

```
  const data = await fetch(https://feature-flags.fix-domain/public/feature-flags?, + new URLSearchParams({
    apiKey: '123e4567-e89b-12d3-a456-426614174000',
    env: 'staging,
    userId: '62eacd2aae77c8534d741247',
  }))
    .then((response) => response.json());
```