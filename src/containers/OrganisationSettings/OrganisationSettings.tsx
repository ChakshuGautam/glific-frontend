import React, { useState } from 'react';
import styles from './OrganisationSettings.module.css';
import * as Yup from 'yup';
import { Input } from '../../components/UI/Form/Input/Input';
import { FormLayout } from '../Form/FormLayout';
import { GET_AUTOMATIONS } from '../../graphql/queries/Automation';
import { GET_ORGANIZATION } from '../../graphql/queries/Organization';
import { CREATE_COLLECTION, DELETE_COLLECTION } from '../../graphql/mutations/Collection';

import { UPDATE_ORGANIZATION } from '../../graphql/mutations/Organization';
import { ReactComponent as Settingicon } from '../../assets/images/icons/Settings/Settings.svg';
import { Checkbox } from '../../components/UI/Form/Checkbox/Checkbox';
import { TimePicker } from '../../components/UI/Form/TimePicker/TimePicker';
import { useQuery } from '@apollo/client';
import { Loading } from '../../components/UI/Layout/Loading/Loading';
import { AutoComplete } from '../../components/UI/Form/AutoComplete/AutoComplete';
import Typography from '@material-ui/core/Typography/Typography';

export interface SettingsProps {
  match: any;
}

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Organisation name is required.'),
});

const SettingIcon = <Settingicon className={styles.Icon} />;

const queries = {
  getItemQuery: GET_ORGANIZATION,
  createItemQuery: CREATE_COLLECTION,
  updateItemQuery: UPDATE_ORGANIZATION,
  deleteItemQuery: DELETE_COLLECTION,
};

const dayList = [
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' },
  { id: 7, label: 'Sunday' },
];

export const OrganisationSettings: React.SFC<SettingsProps> = () => {
  const [name, setName] = useState('');
  const [providerKey, setProviderKey] = useState('');
  const [providerNumber, setProviderNumber] = useState('');
  const [hours, setHours] = useState(true);
  const [enabledDays, setEnabledDays] = useState<any>([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [flowId, setFlowId] = useState<any>({});
  const [IsDisabled, setIsDisable] = useState(false);

  const states = {
    name,
    providerKey,
    providerNumber,
    hours,
    startTime,
    endTime,
    enabledDays,
    flowId,
  };

  const setStates = ({ name, providerKey, providerNumber, outOfOffice }: any) => {
    setName(name);
    setProviderKey(providerKey);
    setProviderNumber(providerNumber);
    setHours(outOfOffice.enabled);
    setIsDisable(!outOfOffice.enabled);
    setOutOfOffice(outOfOffice);
    setFlowId(getFlow(outOfOffice.flowId));
  };

  const setOutOfOffice = (data: any) => {
    setStartTime(data.startTime);
    setEndTime(data.endTime);
    setEnabledDays(getEnabledDays(data.enabledDays));
  };

  const getEnabledDays = (data: any) => {
    return data.filter((option: any) => option.enabled);
  };

  const getFlow = (id: string) => {
    return data.flows.filter((option: any) => option.id == id)[0];
  };

  const { data } = useQuery(GET_AUTOMATIONS);

  if (!data) return <Loading />;

  const handleChange = (value: any) => {
    setIsDisable(!value);
  };

  const formFields = [
    {
      component: Input,
      name: 'name',
      type: 'text',
      placeholder: 'Organisation name',
    },
    {
      component: Input,
      name: 'providerKey',
      type: 'text',
      placeholder: 'Gupshup API key',
    },
    {
      component: Input,
      name: 'providerNumber',
      type: 'text',
      placeholder: 'Gupshup WhatsApp number',
    },
    {
      component: Checkbox,
      name: 'hours',
      fieldLabel: (
        <Typography variant="h6" style={{ color: '#073f24' }}>
          Hours of operations
        </Typography>
      ),
      handleChange: handleChange,
    },
    {
      component: TimePicker,
      name: 'startTime',
      placeholder: 'Opens',
      disabled: IsDisabled,
    },
    {
      component: TimePicker,
      name: 'endTime',
      placeholder: 'Closes',
      disabled: IsDisabled,
    },
    {
      component: AutoComplete,
      name: 'enabledDays',
      options: dayList,
      optionLabel: 'label',
      textFieldProps: {
        variant: 'outlined',
        label: 'Select days',
      },
      disabled: IsDisabled,
    },
    {
      component: AutoComplete,
      name: 'flowId',
      options: data.flows,
      optionLabel: 'name',
      multiple: false,
      textFieldProps: {
        variant: 'outlined',
        label: 'Select default flow',
      },
      disabled: IsDisabled,
      helperText:
        'the selected flow will be triggered for messages received outside hours of operations',
    },
  ];

  const assignDays = (enabledDays: any) => {
    let array: any = [];
    for (let i = 0; i < 7; i++) {
      array[i] = { id: i + 1, enabled: false };
      enabledDays.map((days: any) => {
        if (i + 1 === days.id) {
          array[i] = { id: i + 1, enabled: true };
        }
      });
    }
    return array;
  };

  const setPayload = (payload: any) => {
    return {
      name: payload.name,
      displayName: 'updated organization display name',
      providerKey: payload.providerKey,
      providerNumber: payload.providerNumber,
      outOfOffice: {
        enabled: payload.hours,
        enabledDays: assignDays(payload.enabledDays),
        endTime: payload.endTime,
        flowId: payload.flowId.id,
        startTime: payload.startTime,
      },
    };
  };

  return (
    <FormLayout
      {...queries}
      match={{ params: { id: 1 } }} // for now organization id is hardcoded.
      states={states}
      setStates={setStates}
      validationSchema={FormSchema}
      setPayload={setPayload}
      listItemName="Settings"
      dialogMessage={''}
      formFields={formFields}
      redirectionLink="chat"
      cancelLink="chat"
      linkParameter="id"
      listItem="organization"
      icon={SettingIcon}
      languageSupport={false}
      type={'settings'}
    />
  );
};
