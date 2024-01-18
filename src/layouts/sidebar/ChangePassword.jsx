import React, { useCallback, useState } from 'react';
import ErrorMessage from 'components/shared/BWFormControl/ErrorMessage';
import { useForm, FormProvider } from 'react-hook-form';
import { changeYourPassword } from 'services/users.service';
import FormInput from 'components/shared/BWFormControl/FormInput';
import FormItem from 'components/shared/BWFormControl/FormItem';
import styled from 'styled-components';
import { toast } from 'utils/toast.util';

const StyleShowEye = styled.i`
  position: absolute;
  left: 480px;
  font-size: x-large;
  bottom: 4px;
  cursor: pointer;
`;

const ChangePassword = ({ onClose }) => {
  const methods = useForm();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const getDataChangeEye = useCallback((field) => {
    const isShowPass = methods.watch(`${field}_eye`);
    return {
      typeInput: isShowPass ? 'password' : 'text',
      isShowPass,
    };
  }, []);

  const handleClickEye = useCallback((field) => {
    const isShowPass = methods.watch(`${field}_eye`) ?? false;
    methods.setValue(`${field}_eye`, !isShowPass);
  }, []);

  const onSubmit = async (payload) => {
    setLoading(true);
    changeYourPassword(payload)
      .then((e) => {
        toast.success('Đổi mật khẩu thành công');
        onClose();
      })
      .catch((err) => {
        setLoading(false);
        setError(err?.message);
      });
  };

  return (
    <FormProvider {...methods}>
      <div className='bw_modal bw_modal_open'>
        <div className='bw_modal_container'>
          <div className='bw_title_modal'>
            <h3>Đổi mật khẩu</h3>
            <span className='bw_close_modal fi fi-rr-cross-small' onClick={onClose}></span>
          </div>
          <div className='bw_main_modal bw_border_top'>
            <form className='bw_frm_change'>
              <FormItem label='Mật khẩu cũ' isRequired>
                <FormInput
                  disabled={loading}
                  type={getDataChangeEye('old_password').typeInput}
                  field='old_password'
                  placeholder='***********'
                  validation={{
                    required: 'Mật khẩu cũ là bắt buộc',
                  }}
                />
                <StyleShowEye>
                  <i
                    onClick={() => handleClickEye('old_password')}
                    className={getDataChangeEye('old_password').isShowPass ? `fi-rr-eye` : 'fi-rr-eye-crossed'}></i>
                </StyleShowEye>
              </FormItem>
              <FormItem label='Mật khẩu mới' isRequired>
                <FormInput
                  disabled={loading}
                  type={getDataChangeEye('new_password').typeInput}
                  field='new_password'
                  placeholder='***********'
                  validation={{
                    required: 'Mật khẩu mới là bắt buộc',
                    validate: (p) => {
                      if (p.length < 8) {
                        return 'Mật khẩu phải lớn hơn 8 chữ';
                      }
                    },
                  }}
                />
                <StyleShowEye>
                  <i
                    onClick={() => handleClickEye('new_password')}
                    className={getDataChangeEye('new_password').isShowPass ? `fi-rr-eye` : 'fi-rr-eye-crossed'}></i>
                </StyleShowEye>
              </FormItem>
              <FormItem label='Nhập lại mật khẩu mới' isRequired>
                <FormInput
                  className={'fi-rr-eye'}
                  disabled={loading}
                  type={getDataChangeEye('re_password').typeInput}
                  field='re_password'
                  placeholder='***********'
                  validation={{
                    required: 'Nhập lại mật khẩu mới là bắt buộc',
                    validate: (p) => {
                      if (p !== methods.watch('new_password')) {
                        return 'Mật khẩu không khớp, vui lòng kiểm tra lại';
                      }
                    },
                  }}
                />
                <StyleShowEye>
                  <i
                    onClick={() => handleClickEye('re_password')}
                    className={getDataChangeEye('re_password').isShowPass ? `fi-rr-eye` : 'fi-rr-eye-crossed'}></i>
                </StyleShowEye>
              </FormItem>
              {error && <ErrorMessage message={error} />}
            </form>
          </div>
          <div className='bw_footer_modal'>
            <button
              disabled={loading}
              type='button'
              onClick={methods.handleSubmit(onSubmit)}
              className='bw_btn bw_btn_success'>
              <span className='fi fi-rr-check'></span> Đổi mật khẩu
            </button>
            <button onClick={onClose} type='button' className='bw_btn_outline bw_btn_outline_success'>
              <span disabled={loading} className='fi fi-rr-refresh'></span>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ChangePassword;
