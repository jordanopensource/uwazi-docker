import React from 'react';
import { Translate } from 'app/I18N';
import { TableHeaderContainer } from '../components/TableHeaderContainer';

// in case there will be aesthetic changes to the table header, we can change
// the component here but its probably an overkill now
const generateTableHeader =
  (
    translationKey: string,
    options?: {
      className?: string;
    }
  ) =>
  () => (
    <TableHeaderContainer className={options?.className}>
      {translationKey && <Translate>{translationKey}</Translate>}
    </TableHeaderContainer>
  );

export { generateTableHeader };
