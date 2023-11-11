/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { getErrorMessage } from 'utils/index';
import { setCountNotRead, setMailId } from './actions/index';
import { createOrUpdateMailBox, getListMailDraft, getListMailFlagged, getListMailInbox, getListMailNotRead, getListMailSend, getListMailTrash } from './helpers/call-api';
import MailFilter from './MailFilter';
import MailTable from './MailTable';
import MailMenu from './Tab/MailMenu';
import { useHistory } from 'react-router-dom';

const Mail = ({ typeMail = "inbox" , hiddenMenu, noPaging }) => {

    const dispatch = useDispatch()
    const history = useHistory()

    const [params, setParams] = useState({
        page: 1,
        itemsPerPage: 10,
        is_active: 1
    });

    const [dataList, setDataList] = useState({
        items: [],
        itemsPerPage: 0,
        page: 0,
        totalItems: 0,
        totalPages: 0,
    });

    const [loading, setLoading] = useState(true);
    const { items, itemsPerPage, page, totalItems, totalPages } = dataList;

    const getData = useCallback(() => {
        setLoading(true);
        switch (typeMail) {
            case "send":
                getListMailSend(params)
                    .then(setDataList)
                    .finally(() => {
                        setLoading(false);
                    });
                break
            case "flagged":
                getListMailFlagged(params)
                    .then(setDataList)
                    .finally(() => {
                        setLoading(false);
                    });
                break
            case "draft":
                getListMailDraft(params)
                    .then(setDataList)
                    .finally(() => {
                        setLoading(false);
                    });
                break
            case "trash":
                getListMailTrash(params)
                    .then(setDataList)
                    .finally(() => {
                        setLoading(false);
                    });
                break
            default:
                getListMailInbox(params)
                    .then((value) => {
                        setDataList(value)
                    })
                    .finally(() => {
                        setLoading(false);
                    });
        }
    }, [params]);
    useEffect(getData, [getData]);

    const getCountNotRead = useCallback(() => {
        getListMailNotRead()
            .then((value) => {
                dispatch(setCountNotRead(value))
            })
    }, [])

    useEffect(() => {
        getCountNotRead()
    }, [getCountNotRead])

    const checkValueFlagged = (handleUpdateStatusFlagged, item, index) => {
        let cloneData = { ...item, is_flagged: !item.is_flagged }
        handleUpdateStatusFlagged(cloneData, index)
    }

    const handleUpdateStatusFlagged = async (value, index) => {
        try {
            await createOrUpdateMailBox(value)
            let dataMailClone = [...items]
            dataMailClone[index].is_flagged = value.is_flagged
            setDataList((prev) => ({
                ...prev,
                items: dataMailClone
            }))
        } catch (error) {
            getErrorMessage(error)
        }
    }

    const handleChangeRouterView = async (value) => {
        try {
            if (value.is_draft) {
                history.push(`/mail/detail/${value?.mail_id}`);
            } else {
                // let cloneData = { ...value, is_read: 1 };
                // console.log('---sadfasd',cloneData);
                // await createOrUpdateMailBox(cloneData)
                history.push(`/mail/detail/${value?.mail_id}`)
            }
        } catch (error) {
            getErrorMessage(error)
        }
    }

    return (
        <div className={hiddenMenu ? '' : 'bw_main_wrapp'}>
            <div className='bw_row'>
                {!hiddenMenu && <MailMenu typeMail={typeMail} />}
                <div className={hiddenMenu ? 'bw_col_12' : 'bw_col_9'}>
                    {!hiddenMenu && (
                        <MailFilter
                            onChange={(e) => {
                                setParams((prev) => {
                                    return {
                                        ...prev,
                                        ...e,
                                    };
                                });
                            }}
                        />
                    )}
                    <MailTable
                        hiddenMenu={hiddenMenu}
                        noPaging={noPaging}                        
                        onChangePage={(page) => {
                            setParams({
                                ...params,
                                page,
                            });
                        }}
                        data={items}
                        totalPages={Math.ceil((totalItems || 0) / (itemsPerPage || 0))}
                        itemsPerPage={itemsPerPage}
                        page={ (items && items.length > 0) ? page : 0}
                        totalItems={totalItems}
                        loading={loading}
                        handleUpdateStatusFlagged={handleUpdateStatusFlagged}
                        checkValueFlagged={checkValueFlagged}
                        setDataList={setDataList}
                        typeMail={typeMail}
                        handleChangeRouterView={handleChangeRouterView}
                    />

                </div>
            </div>
        </div>
    )
}

export default Mail
