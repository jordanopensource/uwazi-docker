import PropTypes from 'prop-types';
import React from 'react';
import { useAtomValue } from 'jotai';
import { localeAtom } from 'V2/atoms/translationsAtoms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { availableLanguages } from 'shared/language';
import { loadIcons } from './library';

loadIcons();

const Icon = ({ locale: propLocale = '', ...ownProps }) => {
  const atomLocale = useAtomValue(localeAtom);
  const locale = propLocale || atomLocale;
  const languageData = availableLanguages.find(l => l.key === locale);
  return (
    <FontAwesomeIcon {...ownProps} flip={languageData && languageData.rtl ? 'horizontal' : null} />
  );
};

Icon.propTypes = {
  locale: PropTypes.string,
};

export default Icon;
