import Header from '@/components/Header';
import useLanguage from '@/hooks/useLanguage';
import useTheme from '@/hooks/useTheme';
import useThemedStyles from '@/hooks/useThemedStyles';
import { ProfileStackParamList } from '@/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import makeStyles from './TermsOfService.styles';

type TermsOfServiceProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'TermsOfService'>;
};

const getTermsOfServiceUrl = (language: string) =>
  `https://res.cloudinary.com/sahinmaral/raw/upload/v1783780173/code-talks/documents/${language}/terms-of-service.html`;

const TermsOfService = ({ navigation }: TermsOfServiceProps) => {
  const { t } = useTranslation();
  const styles = useThemedStyles(makeStyles);
  const theme = useTheme();
  const language = useLanguage();
  const [html, setHtml] = useState<string | null>(null);

  const termsOfServiceUrl = getTermsOfServiceUrl(language);

  useEffect(() => {
    let isMounted = true;
    setHtml(null);

    fetch(termsOfServiceUrl)
      .then(response => response.text())
      .then(text => {
        if (isMounted) {
          setHtml(text);
        }
      })
      .catch(() => {
        if (isMounted) {
          setHtml('');
        }
      });

    return () => {
      isMounted = false;
    };
  }, [termsOfServiceUrl]);

  const themedHtml =
    html !== null
      ? `<meta name="viewport" content="width=device-width, initial-scale=1" />
         <style>
           :root { color-scheme: ${theme.mode}; }
           html, body {
             background-color: ${theme.background.primary} !important;
             color: ${theme.text.primary} !important;
           }
           a { color: ${theme.primary} !important; }
         </style>
         ${html}`
      : null;

  return (
    <View style={styles.container}>
      <Header onBackPress={() => navigation.goBack()} title={t('common.termsOfService')} />

      {themedHtml !== null ? (
        <WebView
          originWhitelist={['*']}
          source={{ html: themedHtml, baseUrl: termsOfServiceUrl }}
          style={styles.webview}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
    </View>
  );
};

export default TermsOfService;
