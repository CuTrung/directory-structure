const Transform = require('../../common/helpers/transform.helper');
const config = require('../../../config/config');
const template = {
  'notify_id': '{{#? NOTIFYID}}',
  'notify_type_id': '{{#? NOTIFYTYPEID}}',
  'notify_title': '{{#? NOTIFYTITLE}}',
  'notify_content': '{{#? NOTIFYCONTENT}}',
  'member_id': '{{#? MEMBERID}}', // nguoi tuong tac 
  'avatar_icon': `${config.domain_cdn}{{AVTARICON}}`,
  'group_id': '{{#? GROUPID}}',
  'post_id': '{{#? NEWGROUPPOSTID}}',
  'post_coment_id': '{{#? REPLYTOPOSTCOMMENTID}}',
  'news_id': '{{#? HOTNEWSID}}',
  'media_id': '{{#? HOTMEDIAID}}',
  'member_recommend_id': '{{#? MEMBERRECOMMENDID}}',
  'is_active': '{{ISACTIVE ? 1 : 0}}',
  'is_deleted': '{{ISDELETED ? 1 : 0}}',
  'create_date': '{{#? CREATEDDATE}}',
  'created_user': '{{#? CREATEDUSER}}',
  'updated_date': '{{#? UPDATEDDATE}}',
  'updated_user': '{{#? UPDATEDUSER}}',
  'deleted_date': '{{#? DELETEDDATE}}',
  'deleted_user': '{{#? DELETEDUSER}}',
  'device_token': '{{#? DEVICETOKEN}}',
  'notify_member_id': '{{#? NOTIFYMEMBERID}}',
  'picture_url': [
    {
      "{{#if PICTUREURL}}": `${config.domain_cdn}{{PICTUREURL}}`,
    },
    {
      "{{#else}}": undefined,
    },
  ],
};


let transform = new Transform(template);

const detail = (notify) => {
    return transform.transform(notify, [
        'notify_id', 'notify_title', 'notify_content', 'group_id', 'post_id',
        'post_comment_id', 'news_id', 'media_id', 'device_token', 'notify_member_id', 'picture_url'
    ]);
};

const detailMBHBSG = (notify) => {
    return transform.transform(notify, [
        'notify_id', 'notify_title', 'notify_content', 'device_token', 'notify_member_id', 'member_id'
    ]);
};

const templateMember = {
    'sender': '{{#? SENDER}}',
    'receiver': '{{#? RECEIVER}}',
    'device_token': '{{#? DEVICETOKEN}}',
    'group_name': '{{#? GROUPNAME}}',
}

const info = (member) => {
    let transform = new Transform(templateMember);
    return transform.transform(member, [
        'sender', 'receiver', 'device_token', 'group_name'
    ]);
};

module.exports = {
    detail,
    detailMBHBSG,
    info
};
