import { getDetailMailBox, getOptionDepartment, getOptionUser } from 'pages/Mail/helpers/call-api';
import React, { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MailMenu from '../MailMenu';
import MailDetailTable from './MailDetailTable';
import { useSelector, useDispatch } from 'react-redux';
import { setMailId } from '../../actions/index';
import { toast } from 'react-toastify';
import useQueryString from 'hooks/use-query-string';
const MailDetail = () => {
  const { id: mailbox_id } = useParams();
  const dispatch = useDispatch();
  dispatch(setMailId(mailbox_id));

  // const isRefesh = useSelector((state) => state.mailbox)?.isRefesh

  const [loading, setLoading] = useState(true);
  const [isRefesh, setIsRefesh] = useState(false);
  const [dataOpts, setDataOpts] = useState([]);
  const [dataMailDetail, setDataMailDetail] = useState({
    info: {},
    data: [],
  });

  const [dataAdmin, setDataAdmin] = useState({
    id: 'administrator',
    name: 'Administrator Account',
    parent_id: '45D5BE20-C19A-11E9-9CB5-2A2AE2DBCCE4',
  });

  const getData = useCallback(() => {
    // if(isRefesh == true){
    //     setLoading(true);
    // }else{
    //     setLoading(false);
    // }
    getDetailMailBox(mailbox_id)
      .then((response) => {
        setDataMailDetail({
          info: response.infoMail,
          data: response.dataMailDetail,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mailbox_id, isRefesh]);
  useEffect(getData, [getData]);

  const getInitData = async () => {
    try {
      let data = [{ label: 'Gửi cho tất cả ', value: 'sendAll' }];
      let nameOpts = ['Danh sách phòng ban', 'Danh sách nhân viên'];

      let dataDepartment = await getOptionDepartment();
      dataDepartment = dataDepartment.map(({ id, name }) => ({ value: `PB-${id}`, label: name }));

      let dataUser = await getOptionUser();
      dataUser = [dataAdmin]
        .concat(dataUser)
        .map(({ id, name }) => ({ value: `USER-${id}`, label: `${id} - ${name}` }));
      let arrayOpts = [[...dataDepartment], [...dataUser]];

      for (let i = 0; i < nameOpts.length; i++) {
        let obj = {};
        let label = nameOpts[i];
        obj.label = label;
        obj.options = arrayOpts[i];
        data.push(obj);
      }
      setDataOpts(data);
    } catch (error) {
      toast.error(error ? error.message : 'Có lỗi xảy ra!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    getInitData();
  }, []);

  const refeshData = () => {
    setIsRefesh(!isRefesh);
  };

  const { data, info } = dataMailDetail;

  return (
    <div className='bw_main_wrapp'>
      <div className='bw_row'>
        <MailMenu />
        <div className='bw_col_9'>
          <MailDetailTable
            data={data}
            info={info}
            loading={loading}
            dataOpts={dataOpts}
            refeshData={refeshData}
            setDataOpts={setDataOpts}
          />
        </div>
      </div>
    </div>
  );
};

export default MailDetail;
