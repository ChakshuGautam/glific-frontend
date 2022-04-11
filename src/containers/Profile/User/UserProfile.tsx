import React from 'react';

import { Profile } from '../Profile';

export interface UserProfileProps {}

export const UserProfile: React.FC<UserProfileProps> = () => (
  <div data-testid="UserProfile">
    <Profile profileType="User" redirectionLink="chat/" />
  </div>
);

export default UserProfile;
