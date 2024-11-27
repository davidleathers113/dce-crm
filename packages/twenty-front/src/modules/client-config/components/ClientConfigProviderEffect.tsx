import { apiConfigState } from '@/client-config/states/apiConfigState';
import { billingState } from '@/client-config/states/billingState';
import { captchaProviderState } from '@/client-config/states/captchaProviderState';
import { chromeExtensionIdState } from '@/client-config/states/chromeExtensionIdState';
import { clientConfigApiStatusState } from '@/client-config/states/clientConfigApiStatusState';
import { isAnalyticsEnabledState } from '@/client-config/states/isAnalyticsEnabledState';
import { isDebugModeState } from '@/client-config/states/isDebugModeState';
import { isSignInPrefilledState } from '@/client-config/states/isSignInPrefilledState';
import { isMultiWorkspaceEnabledState } from '@/client-config/states/isMultiWorkspaceEnabledState';
import { sentryConfigState } from '@/client-config/states/sentryConfigState';
import { supportChatState } from '@/client-config/states/supportChatState';
import { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useGetClientConfigQuery } from '~/generated/graphql';
import { isDefined } from '~/utils/isDefined';
import { urlManagerState } from '@/url-manager/states/url-manager.state';

export const ClientConfigProviderEffect = () => {
  const setIsDebugMode = useSetRecoilState(isDebugModeState);
  const setIsAnalyticsEnabled = useSetRecoilState(isAnalyticsEnabledState);
  const setUrlManager = useSetRecoilState(urlManagerState);

  const setIsSignInPrefilled = useSetRecoilState(isSignInPrefilledState);
  const setIsMultiWorkspaceEnabled = useSetRecoilState(
    isMultiWorkspaceEnabledState,
  );

  const setBilling = useSetRecoilState(billingState);
  const setSupportChat = useSetRecoilState(supportChatState);

  const setSentryConfig = useSetRecoilState(sentryConfigState);
  const [clientConfigApiStatus, setClientConfigApiStatus] = useRecoilState(
    clientConfigApiStatusState,
  );

  const setCaptchaProvider = useSetRecoilState(captchaProviderState);

  const setChromeExtensionId = useSetRecoilState(chromeExtensionIdState);

  const setApiConfig = useSetRecoilState(apiConfigState);

  const { data, loading, error } = useGetClientConfigQuery({
    skip: clientConfigApiStatus.isLoaded,
  });

  useEffect(() => {
    if (loading) return;
    setClientConfigApiStatus((currentStatus) => ({
      ...currentStatus,
      isLoaded: true,
    }));

    if (error instanceof Error) {
      setClientConfigApiStatus((currentStatus) => ({
        ...currentStatus,
        isErrored: true,
        error,
      }));
      return;
    }

    if (!isDefined(data?.clientConfig)) {
      return;
    }

    setClientConfigApiStatus((currentStatus) => ({
      ...currentStatus,
      isErrored: false,
      error: undefined,
    }));

    setIsDebugMode(data?.clientConfig.debugMode);
    setIsAnalyticsEnabled(data?.clientConfig.analyticsEnabled);
    setIsSignInPrefilled(data?.clientConfig.signInPrefilled);
    setIsMultiWorkspaceEnabled(data?.clientConfig.isMultiWorkspaceEnabled);

    setBilling(data?.clientConfig.billing);
    setSupportChat(data?.clientConfig.support);

    setSentryConfig({
      dsn: data?.clientConfig?.sentry?.dsn,
      release: data?.clientConfig?.sentry?.release,
      environment: data?.clientConfig?.sentry?.environment,
    });

    setCaptchaProvider({
      provider: data?.clientConfig?.captcha?.provider,
      siteKey: data?.clientConfig?.captcha?.siteKey,
    });

    setChromeExtensionId(data?.clientConfig?.chromeExtensionId);
    setApiConfig(data?.clientConfig?.api);
    setUrlManager({
      defaultSubdomain: data?.clientConfig?.defaultSubdomain,
      frontDomain: data?.clientConfig?.frontDomain,
    });
  }, [
    data,
    setIsDebugMode,
    setIsSignInPrefilled,
    setIsMultiWorkspaceEnabled,
    setSupportChat,
    setBilling,
    setSentryConfig,
    loading,
    setClientConfigApiStatus,
    setCaptchaProvider,
    setChromeExtensionId,
    setApiConfig,
    setIsAnalyticsEnabled,
    error,
    setUrlManager,
  ]);

  return <></>;
};
