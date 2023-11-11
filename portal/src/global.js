export default async function regisWindow() {
  Object.assign(window, {
    //Create ref shortcut
    _$g: {
      theme: 'antd',
      userAuth: null,
      dialogs: null,
      rdr: function () {
        alert('[rdr] Not yet ready!');
      },
    },
  });
}
