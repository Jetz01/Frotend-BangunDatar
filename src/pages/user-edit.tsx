import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserViewEdit } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Edit Siswa - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserViewEdit />
    </>
  );
}
