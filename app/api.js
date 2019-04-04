'use strict';

exports.eefocus = {
  checkJoin: 'https://www.eefocus.com/passport/api.php?act=checkjoin&pid=2&uid={uid}',
  join: 'https://www.eefocus.com/passport/api.php?act=join&pid=2&uid={uid}',
  getProfile: 'https://account.eefocus.com/account/api/getprofile/id-{uid}',
  getAvatar: 'https://account.eefocus.com/api/user/avatar/get',
  mgetAvatar: 'https://account.eefocus.com/api/user/avatar/mget',
  uclientGet: 'https://account.eefocus.com/api/user/user/get',
  uclientMget: 'https://account.eefocus.com/api/user/user/mget',
  timelineAdd: 'https://account.eefocus.com/api/user/timeline/insert',
};
