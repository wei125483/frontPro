import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception101 = () => (
  <Exception
    type="101"
    btnShow={false}
    desc={formatMessage({ id: 'app.exception.home' })}
    linkElement={Link}
  />
);

export default Exception101;
