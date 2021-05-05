import React, { useEffect, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

import styles from './AddAttachment.module.css';
import { DialogBox } from '../../../../components/UI/DialogBox/DialogBox';
import { Dropdown } from '../../../../components/UI/Form/Dropdown/Dropdown';
import { Input } from '../../../../components/UI/Form/Input/Input';
import { MessageType } from '../../ChatConversations/MessageType/MessageType';
import { MEDIA_MESSAGE_TYPES } from '../../../../common/constants';
import { ReactComponent as CrossIcon } from '../../../../assets/images/icons/Cross.svg';
import { validateMedia } from '../../../../common/utils';
import { UPLOAD_MEDIA } from '../../../../graphql/mutations/Chat';
import { ReactComponent as UploadIcon } from '../../../../assets/images/icons/Upload.svg';

const options = MEDIA_MESSAGE_TYPES.map((option: string) => ({
  id: option,
  label: <MessageType type={option} color="dark" />,
}));

export interface AddAttachmentPropTypes {
  setAttachment: any;
  setAttachmentURL: any;
  setAttachmentAdded: any;
  setAttachmentType: any;
  attachmentURL: any;
  attachmentType: any;
}

export const AddAttachment: React.FC<AddAttachmentPropTypes> = ({
  setAttachment,
  setAttachmentAdded,
  setAttachmentURL,
  setAttachmentType,
  attachmentURL,
  attachmentType,
}: AddAttachmentPropTypes) => {
  const [onSubmit, setOnSubmit] = useState(false);
  const [errors, setErrors] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<null | string>(null);
  const [verifying, setVerifying] = useState(false);

  const { t } = useTranslation();

  const [uploadMedia] = useMutation(UPLOAD_MEDIA, {
    onCompleted: (data: any) => {
      console.log(data);
      setAttachmentURL(data.uploadMedia);
      setUploading(false);
    },
    onError: (error: any) => {
      setUploading(false);
      console.log('Error', error);
    },
  });

  const validateURL = () => {
    if (attachmentURL && attachmentType && onSubmit) {
      setVerifying(true);
      setErrors(null);

      validateMedia(attachmentURL, attachmentType).then((response: any) => {
        if (!response.data.is_valid) {
          setVerifying(false);
          setErrors(response.data.message);
        } else if (response.data.is_valid) {
          setVerifying(false);
          setAttachmentAdded(true);
          setAttachment(false);
          setOnSubmit(false);
          setErrors(null);
        }
      });
    }
  };

  useEffect(() => {
    validateURL();
  }, [attachmentURL, attachmentType, onSubmit]);

  const validate = (value: any) => {
    if (value !== attachmentURL) {
      setOnSubmit(false);
      setAttachmentURL(value);
    } else if (!value) {
      setErrors(null);
    }
  };

  const input = {
    component: Input,
    name: 'attachmentURL',
    type: 'text',
    placeholder: t('Attachment URL'),
    validate,
    helperText: verifying && t('Please wait for the attachment URL verification'),
    disabled: fileName !== null,
  };

  let formFieldItems: any = [
    {
      component: Dropdown,
      options,
      name: 'attachmentType',
      placeholder: 'Type',
      fieldValue: attachmentType,
      fieldChange: (event: any) => {
        setAttachmentType(event?.target.value);
        setOnSubmit(false);
        setErrors(null);
      },
    },
  ];

  formFieldItems = attachmentType !== '' ? [...formFieldItems, input] : formFieldItems;

  const validationSchema = Yup.object().shape({
    attachmentType: Yup.string().required(t('Type is required.')),
    attachmentURL: Yup.string().required(t('URL is required.')),
  });

  const displayWarning = () => {
    if (attachmentType === 'STICKER') {
      return (
        <div className={styles.FormHelperText}>
          <ol>
            <li>{t('Animated stickers are not supported.')}</li>
            <li>{t('Captions along with stickers are not supported.')}</li>
          </ol>
        </div>
      );
    }
    return (
      <div className={styles.FormHelperText}>
        <ol>
          <li>{t('Captions along with audio are not supported.')}</li>
        </ol>
      </div>
    );
  };

  const onSubmitHandle = (itemData: { attachmentURL: any; attachmentType: any }) => {
    setAttachmentType(itemData.attachmentType);
    setAttachmentURL(itemData.attachmentURL);
  };

  const addAttachment = (event: any) => {
    const media = event.target.files[0];

    if (media) {
      const mediaName = media.name;
      const extension = mediaName.slice((Math.max(0, mediaName.lastIndexOf('.')) || Infinity) + 1);
      const shortenedName = mediaName.length > 20 ? `${mediaName.slice(0, 20)}...` : mediaName;
      setFileName(shortenedName);
      setUploading(true);
      uploadMedia({
        variables: {
          media,
          extension,
        },
      });
    }
  };

  const form = (
    <Formik
      enableReinitialize
      initialValues={{ attachmentURL, attachmentType }}
      validationSchema={validationSchema}
      onSubmit={(itemData) => {
        setOnSubmit(true);
        onSubmitHandle(itemData);
      }}
    >
      {({ submitForm }) => (
        <Form className={styles.Form} data-testid="formLayout" encType="multipart/form-data">
          <DialogBox
            titleAlign="left"
            title={t('Add attachments to message')}
            handleOk={() => {
              submitForm();
            }}
            handleCancel={() => {
              setAttachment(false);
              setAttachmentType('');
              setAttachmentURL('');
              setAttachmentAdded(false);
            }}
            buttonOk={t('Add')}
            alignButtons="left"
          >
            <div className={styles.DialogContent} data-testid="attachmentDialog">
              {formFieldItems.map((field: any) => (
                <Field {...field} key={field.name} validateURL={errors} />
              ))}
              {attachmentType !== '' && (
                <div className={styles.CrossIcon}>
                  <CrossIcon
                    data-testid="crossIcon"
                    onClick={() => {
                      setAttachmentType('');
                      setAttachmentURL('');
                      setAttachmentAdded(false);
                      setErrors(null);
                    }}
                  />
                </div>
              )}
              <div className={styles.FormError}>{errors}</div>
            </div>
            {attachmentType !== '' && (
              <>
                <div className={styles.UploadContainer}>
                  <label className={styles.Upload} htmlFor="uploadFile">
                    {fileName !== null ? (
                      fileName
                    ) : (
                      <>
                        <UploadIcon /> Upload File
                      </>
                    )}

                    <input type="file" id="uploadFile" onChange={addAttachment} />
                  </label>
                </div>
                {uploading && <div>Please wait for upload</div>}
              </>
            )}

            {attachmentType === 'STICKER' || attachmentType === 'AUDIO' ? displayWarning() : null}
          </DialogBox>
        </Form>
      )}
    </Formik>
  );

  return form;
};
