import React from 'react';
import { Outlet } from 'react-router';
import { Helmet } from 'react-helmet';
import { t } from 'app/I18N';
import { SettingsNavigation } from './SettingsNavigation';

const Settings = () => (
  <div
    className="tw-content"
    style={{
      display: 'flex',
      width: 'calc(100% + 30px)',
      height: '100%',
      marginLeft: '-15px',
      marginRight: '-15px',
    }}
  >
    <Helmet>
      <title>{t('System', 'Settings', null, false)}</title>
    </Helmet>
    <div className="min-w-[250px] border-r border-gray-200 bg-gray-50 h-full">
      <SettingsNavigation />
    </div>
    <div className="flex-1 overflow-auto h-full">
      <Outlet />
    </div>
  </div>
);

export { Settings };
