import BWButton from '.';

// const ChildButton = ({ onClick, icon, title }) => {
//   return (
//     <button
//       style={{
//         backgroundColor: 'transparent',
//         border: 'none',
//         padding: 0,
//         margin: 0,
//         cursor: 'pointer',
//         outline: 'none',
//       }}
//       onClick={onClick}>
//       <i className={icon} style={{ marginRight: 5 }}></i>
//       {title}
//     </button>
//   );
// };

export const DropdownButton = ({
  loading,
  disabled,
  submit,
  reset,
  type,
  outline,
  icon,
  content,
  onClick,
  style,
  table,
  multipleActions,
  placement = 'top',
  ...props
}) => {
  // [{key: '', title: '', icon: '', onClick: () => {}}]
  const renderBtnChild = useMemo(
    () =>
      multipleActions.map((item, index) => {
        return {
          key: item.key ?? index,
          //   label: <ChildButton onClick={item.onClick} icon={item.icon} title={item.title} />,
          label: <BWButton {...item} />,
        };
      }),
    [],
  );
  return (
    <>
      <Dropdown menu={{ items: renderBtnChild }} placement={placement} arrow={{ pointAtCenter: true }}>
        <BWButton
          loading={loading}
          disabled={disabled}
          submit={submit}
          reset={reset}
          type={type}
          outline={outline}
          icon={icon}
          content={content}
          onClick={onClick}
          style={style}
          table={table}
          {...props}
        />
      </Dropdown>
    </>
  );
};
