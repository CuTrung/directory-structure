import React, { useCallback, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  registerables as registerablesJS,
} from 'chart.js';
import CountUp from 'react-countup';
import {
  getDebit,
  getListAnnounceDashboard,
  getListMail,
  getListStock,
  getReceiveslipChart,
  getSummary,
} from './dashboard.service';
import RevenueChart from './components/RevenueChart';
import { DatePicker, Empty } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import _ from 'lodash';
import Mail from 'pages/Mail/Mail';
import DebitChart from './components/DebitChart';
import CheckAccess from 'navigation/CheckAccess';
import styled from 'styled-components';
const { RangePicker } = DatePicker;
ChartJS.register(...registerablesJS);
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// export const options = {
//   scales: {
//     y: {
//       beginAtZero: true,
//     },
//   },
//   plugins: {
//     legend: false,
//   },
// };

// const dataChart2 = {
//   labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
//   datasets: [
//     {
//       type: 'line',
//       label: 'LNG/DT',
//       data: [15, 10, 20, 15, 21, 16, 18, 19.5, 15, 12, 31, 13],
//       backgroundColor: ['#2D9CDB'],
//       borderColor: ['#2D9CDB'],
//       borderWidth: 2,
//       tension: 0.5,
//     },
//     {
//       type: 'line',
//       label: 'Giá vốn/DT',
//       data: [11, 9, 7, 10, 11, 11, 14, 14, 8.6, 9, 14, 13],
//       backgroundColor: ['#27AE60'],
//       borderColor: ['#27AE60'],
//       borderWidth: 2,
//       tension: 0.5,
//     },
//   ],
// };
const DebitChartStyled = styled.div`
  .bw_debit_chart {
    width: 476px;
    height: 476px;
  }
`;

const DashboardPage = () => {
  const [summaryData, setSumaryData] = useState([]);
  const [announceList, setAnnounceList] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [receiveslipData, setReceiveslipData] = useState([]);
  const [stockData, setStockData] = useState({
    list_product: [],
    list_category: [],
  });
  const [debitData, setDebitData] = useState({});
  const statusRevenue = summaryData?.total_revenue_quarter_now > summaryData?.total_revenue_quarter_before;
  const statusComission = summaryData?.total_commission_quarter_now > summaryData?.total_commission_quarter_before;
  const statusOrder = summaryData?.total_order_quarter_now > summaryData?.total_order_quarter_before;
  const statusGoods = summaryData?.total_goods_quarter_now > summaryData?.total_goods_quarter_before;

  const loadSumaryData = useCallback(() => {
    getSummary()
      .then((e) => setSumaryData(e))
      .finally(() => {});
  }, []);
  useEffect(loadSumaryData, [loadSumaryData]);

  const loadGetListMail = useCallback(() => {
    getListMail()
      .then((e) => setEmailList(e))
      .finally(() => {});
  }, []);
  useEffect(loadGetListMail, [loadGetListMail]);

  const loadAnnouceDashboardList = useCallback(() => {
    getListAnnounceDashboard()
      .then((e) => setAnnounceList(e?.items?.data))
      .finally(() => {});
  }, []);
  useEffect(loadAnnouceDashboardList, [loadAnnouceDashboardList]);

  const getColor = (value) => (value ? 'bw_green' : 'bw_red');
  const getUpDown = (value) => (value ? '+' : '-');
  const getIcon = (value) => (value ? 'bw_image/icon/i__up.svg' : 'bw_image/icon/i__down.svg');

  const loadReceiveslipChart = useCallback(() => {
    if (startDate && endDate) {
      getReceiveslipChart({
        start_date: startDate,
        end_date: endDate,
      })
        .then((e) => setReceiveslipData(e))
        .finally(() => {});
    }
  }, [startDate, endDate]);
  useEffect(loadReceiveslipChart, [loadReceiveslipChart]);

  const loadStock = useCallback(() => {
    getListStock()
      .then((e) => setStockData(e))
      .finally(() => {});
  }, []);
  useEffect(loadStock, [loadStock]);

  const loadDebit = useCallback(() => {
    getDebit()
      .then((e) => setDebitData(e))
      .finally(() => {});
  }, []);
  useEffect(loadDebit, [loadDebit]);

  useEffect(() => {
    const monthNow = new Date().getMonth();
    const yearNow = new Date().getFullYear();

    setStartDate(moment(new Date(yearNow, monthNow, 1)).format('DD/MM/YYYY'));
    setEndDate(moment(new Date(yearNow, monthNow + 1, 0)).format('DD/MM/YYYY'));
  }, []);

  return (
    <div className='bw_main_wrapp'>
      <div className='bw_row'>
        <div className='bw_c2 bw_mt_1'>
          <div className='bw_card_items'>
            <span className='bw_icon_card bw_orange'>
              <i className='fi fi-rr-dollar'></i>
            </span>
            <p>Tổng doanh thu (đ)</p>
            <h4>
              <CountUp end={summaryData?.total_revenue_quarter_now} />
            </h4>
            <span className={`bw_trans ${getColor(statusRevenue)} `}>
              <img src={getIcon(statusRevenue)} alt='' /> {getUpDown(statusRevenue)}{' '}
              <CountUp end={summaryData?.revenue_quarter_percent} />%
            </span>
          </div>
        </div>
        <div className='bw_c2 bw_mt_1'>
          <div className='bw_card_items'>
            <span className='bw_icon_card bw_orange'>
              <i className='fi fi-rr-dollar'></i>
            </span>
            <p>Hoa hồng (đ)</p>
            <h4>
              <CountUp end={summaryData?.total_commission_quarter_now} />
            </h4>
            <span className='bw_trans bw_green'>
              <img src={getIcon(statusComission)} alt='' /> {getUpDown(statusComission)}{' '}
              <CountUp end={summaryData?.comission_quarter_percent} />%
            </span>
          </div>
        </div>
        <div className='bw_c2 bw_mt_1'>
          <div className='bw_card_items'>
            <span className='bw_icon_card bw_red'>
              <i className='fi fi-rr-shopping-cart-check'></i>
            </span>
            <p>Đơn hàng</p>
            <h4>
              <CountUp end={summaryData?.total_order_quarter_now} />
            </h4>
            <span className='bw_trans bw_red'>
              <img src={getIcon(statusOrder)} alt='' /> {getUpDown(statusOrder)}{' '}
              <CountUp end={summaryData?.order_quarter_percent} />%
            </span>
          </div>
        </div>
        <div className='bw_c2 bw_mt_1'>
          <div className='bw_card_items'>
            <span className='bw_icon_card '>
              <i className='fi fi-rr-smartphone'></i>
            </span>
            <p>Hàng đang nhập về</p>
            <h4>
              <CountUp end={summaryData?.total_goods_quarter_now} />
            </h4>
            <span className='bw_trans bw_green'>
              <img src={getIcon(statusGoods)} alt='' /> {getUpDown(statusGoods)}{' '}
              <CountUp end={summaryData?.goods_quarter_percent} />%
            </span>
          </div>
        </div>
        <div className='bw_c2 bw_mt_1'>
          <div className='bw_card_items'>
            <span className='bw_icon_card bw_blue'>
              <i className='fi fi-rr-calendar'></i>
            </span>
            <p>Phép còn</p>
            <h4>{summaryData?.total_off_work}/12</h4>
            <span onClick={() => window._$g.rdr(`/off-work`)}>Xem thêm</span>
          </div>
        </div>
        <div className='bw_col_8 bw_mt_2'>
          <div className='bw_card_items'>
            <div className='bw_row bw_align_items_center'>
              <div className='bw_col_7'>
                <h2 className='bw_title_card'>Báo cáo doanh thu</h2>
              </div>
              <div className='bw_col_5'>
                <RangePicker
                  format='DD/MM/YYYY'
                  placeholder={['Từ ngày', 'Đến ngày']}
                  style={{ float: 'right', padding: '10px 10px' }}
                  value={startDate || endDate ? [dayjs(startDate, 'DD/MM/YYYY'), dayjs(endDate, 'DD/MM/YYYY')] : ''}
                  onChange={(dates, dateStrings) => {
                    if (dates) {
                      setStartDate(dateStrings[0]);
                      setEndDate(dateStrings[1]);
                    }
                  }}
                />
              </div>
            </div>
            <div className='bw_img_chart bw_mt_1'>
              <div className='bw_number_tu bw_text_center'>
                Tổng doanh thu:{' '}
                <b>
                  <CountUp end={(receiveslipData ?? []).reduce((o, x) => o + x?.total_money ?? 0, 0)} />đ
                </b>
              </div>
              <RevenueChart data={receiveslipData} />
            </div>
          </div>
        </div>
        <CheckAccess permission={'MD_DEBIT_VIEW'}>
          <div className='bw_col_4 bw_mt_2'>
            <div className='bw_card_items'>
              <h2 className='bw_title_card'>
                <span className='fi fi-rr-box'></span> Công nợ
              </h2>
              <DebitChartStyled>
                <div className='bw_mt_1 bw_border_top bw_box_list_card'>
                  <div className='bw_debit_chart'>
                    <DebitChart data={debitData} />
                  </div>
                  <a href='/debit'>Xem chi tiết</a>
                </div>
              </DebitChartStyled>
            </div>
          </div>
        </CheckAccess>
        {/* <div className='bw_col_6 bw_mt_2'>
          <div className='bw_card_items'>
            <div className='bw_row bw_align_items_center'>
              <div className='bw_col_7'>
                <h2 className='bw_title_card'>Lợi nhuận</h2>
              </div>
              <div className='bw_col_5'>
                <div className='bw_show_date' id='bw_choose_calendar'>
                  <span className='fi fi-rr-calendar'></span> 01/10/2022 - 30/10/2022
                </div>
                <div className='bw_hide bw_choose_inp'>
                  <div className='bw_show_calendar'>
                    <input type='text' id='calendar2' data-mode='range' />
                  </div>
                  <a className='bw_apply' id='bw_choose_date'>
                    Áp dụng
                  </a>
                </div>
              </div>
            </div>
            <div className='bw_img_chart bw_mt_1'>
              <div className='bw_number_tu bw_text_center'>
                Tổng lợi nhuận: <b>20.000.000 đ</b>
              </div>
              <Chart options={options} data={dataChart2} />
            </div>
          </div>
        </div> */}
        <div className='bw_col_6 bw_mt_2'>
          <div className='bw_card_items'>
            <h2 className='bw_title_card'>
              <span className='fi fi-rr-store-alt'></span> Tồn kho
            </h2>
            <div className='bw_mt_1 bw_border_top bw_box_list_card'>
              <div className='bw_title_list_card'>
                <b>Ngành hàng</b>
                <b>Số lượng tồn</b>
              </div>
              <ul>
                {' '}
                {stockData?.list_category?.map((x, index) => (
                  <li key={index}>
                    <span>{x.category_name}</span>
                    <b>{x.total}</b>
                  </li>
                ))}
              </ul>
              <a href='/stocks-detail'>Xem chi tiết</a>
            </div>
          </div>
        </div>
        <CheckAccess permission={'ST_STOCKSDETAIL_VIEW'}>
          <div className='bw_col_6 bw_mt_2'>
            <div className='bw_card_items'>
              <h2 className='bw_title_card'>
                <span className='fi fi-rr-box'></span> Sản phẩm tồn kho
              </h2>
              <div className='bw_mt_1 bw_border_top bw_box_list_card'>
                <div className='bw_title_list_card'>
                  <b>Sản phẩm</b>
                  <b>Số lượng tồn</b>
                </div>
                <ul>
                  {stockData?.list_product?.map((x, i) => (
                    <li key={i}>
                      <span>{x.product_name}</span>
                      <b>{x.total}</b>
                    </li>
                  ))}
                </ul>
                <a href='/stocks-detail'>Xem chi tiết</a>
              </div>
            </div>
          </div>
        </CheckAccess>
        <div className='bw_col_6 bw_mt_2'>
          <div className='bw_card_items'>
            <h2 className='bw_title_card'>
              <span className='fi fi-rr-envelope-open-text' /> Hộp thư <i>({emailList?.totalItems})</i>
            </h2>
            <div className='bw_mt_2 bw_border_top'>
              <Mail hiddenMenu noPaging />
            </div>
            {Boolean(emailList?.totalItems) && (
              <div className='bw_footer_card'>
                <a href='/mail' className='bw_green'>
                  Xem tất cả
                </a>
                <span className='fi fi-rr-angle-double-small-right' />
              </div>
            )}
          </div>
        </div>
        <div className='bw_col_6 bw_mt_2'>
          <div className='bw_card_items'>
            <h2 className='bw_title_card'>
              <span className='fi fi-rr-bell'></span> Thông báo nội bộ
            </h2>
            <div>
              <div className='bw_mt_2 bw_border_top'>
                {_.size(announceList) ? (
                  (announceList ?? [])?.map((o, index) => {
                    return (
                      <a
                        key={index}
                        href={`/notification/detail/${o?.announce_id}`}
                        className='bw_list_email bw_list_notice'>
                        <div className='bw_us_email bw_us_notice'>
                          <img alt='' src={o?.user_img_url} />
                          <h3>{o?.user_fullname}</h3>
                        </div>
                        <p>{o?.announce_title} </p>
                        <span className='bw_has_file'>
                          <i className='fi fi-rr-clip' />
                        </span>
                        <span className='bw_time_email'>{moment(o?.news_date).startOf('hour').fromNow()}</span>
                      </a>
                    );
                  })
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='bw_mt_5' description='Không có dữ liệu' />
                )}
              </div>
              {Boolean(_.size(announceList)) && (
                <div className='bw_footer_card'>
                  <a href='/announce-view/' className='bw_green'>
                    Xem tất cả
                  </a>
                  <span className='fi fi-rr-angle-double-small-right' />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* <div className='bw_col_12 bw_mt_2'>
          <div className='bw_card_items'>
            <h2 className='bw_title_card'>
              <span className='fi fi-rr-clock-two'></span> Lịch sử hoạt động
            </h2>
            <div className='bw_mt_2 bw_border_top'>
              <div className='bw_table_responsive'>
                <table className='bw_table'>
                  <thead>
                    <th className='bw_sticky bw_check_sticky'>STT</th>
                    <th>Thời gian</th>
                    <th>Phiếu yêu cầu</th>
                    <th>Nội dung</th>
                    <th className='bw_sticky bw_action_table bw_text_center'>Thao tác</th>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='bw_sticky bw_check_sticky'>1</td>
                      <td>21/12/2021 12:00</td>
                      <td>#PXNB22092700001</td>
                      <td>
                        <p>
                          <b>Chuyển trạng thái</b>
                        </p>
                        10020 - Hoàng Văn Minh đã chuyển task từ <span className='bw_black'>Tiếp nhận</span> -{' '}
                        <span className='bw_blue'>Đang xử lý</span>
                      </td>
                      <td className='bw_text_center'>
                        <a href='index.php?page=641' className='bw_green'>
                          <i className='fi fi-rr-plus'></i>
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className='bw_sticky bw_check_sticky'>1</td>
                      <td>21/12/2021 12:00</td>
                      <td>#PXNB22092700323</td>
                      <td>
                        <p>
                          <b>Chuyển trạng thái</b>
                        </p>
                        10020 - Hoàng Văn Minh đã chuyển task từ <span className='bw_black'>Tiếp nhận</span> -{' '}
                        <span className='bw_blue'>Đang xử lý</span>
                      </td>
                      <td className='bw_text_center'>
                        <a href='index.php?page=641' className='bw_green'>
                          <i className='fi fi-rr-plus'></i>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='bw_footer_card'>
              <a href='index.php?page=54' className='bw_green'>
                Xem tất cả
              </a>
              <span className='fi fi-rr-angle-double-small-right'></span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;
