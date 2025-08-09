import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Palette } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { toast } from 'react-toastify';
import { useUser, useUpdateUserPreferences } from '../../hooks/useUser';

interface PreferencesProps {
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Preferences: React.FC<PreferencesProps> = ({ theme, onThemeChange }) => {
  const { t, i18n } = useTranslation();
  const { data: user } = useUser();
  const updatePreferences = useUpdateUserPreferences();

  // Initialize user preferences when user data is loaded
  useEffect(() => {
    if (user) {
      if (user.language && user.language !== i18n.language) {
        i18n.changeLanguage(user.language);
      }
      if (user.theme && user.theme !== theme) {
        onThemeChange(user.theme as 'light' | 'dark');
      }
    }
  }, [user, i18n, theme, onThemeChange]);

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('preferred-language', language);
    
    // Save to user profile
    updatePreferences.mutate(
      { language },
      {
        onSuccess: () => {
          toast.success(t('accountSettings.languageUpdated'));
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      }
    );
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    onThemeChange(newTheme);
    
    // Save to user profile
    updatePreferences.mutate(
      { theme: newTheme },
      {
        onSuccess: () => {
          toast.success(t('accountSettings.themeUpdated'));
        },
        onError: () => {
          toast.error(t('common.error'));
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t('accountSettings.preferences')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('accountSettings.selectLanguage')}
            </Label>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder={t('accountSettings.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">
                  <div className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>English</span>
                  </div>
                </SelectItem>
                <SelectItem value="fr">
                  <div className="flex items-center gap-2">
                    <span>🇫🇷</span>
                    <span>Français</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme-select" className="text-sm font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('accountSettings.themePreference')}
            </Label>
            <Select value={theme} onValueChange={handleThemeChange}>
              <SelectTrigger id="theme-select">
                <SelectValue placeholder={t('accountSettings.themePreference')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <span>☀️</span>
                    <span>{t('accountSettings.lightTheme')}</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <span>🌙</span>
                    <span>{t('accountSettings.darkTheme')}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Preferences;