/* eslint-disable */
import {Text, View, TextInput, Button} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';

const regexPhoneNumber = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
const schema = yup.object().shape({
  firstName: yup.string().required(),
  email: yup.string().required().email(),
  phoneNumber: yup.string().required().matches(regexPhoneNumber),
});

export default function ReactHookForm() {
  const {
    control,
    handleSubmit,
    formState: {errors},
    asd,
  } = useForm({
    defaultValues: {
      firstName: '',
      email: '',
      phoneNumber: '',
    },
    mode: 'obChange',
    resolver: yupResolver(schema),
  });
  const onSubmit = data => console.warn(data);

  return (
    <View style={{flex: 1, paddingHorizontal: 16}}>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{marginVertical: 5}}>
            <Text>First name</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'black',
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
        name="firstName"
      />
      {errors.firstName && (
        <Text style={{color: 'red'}}>{errors.firstName.message}</Text>
      )}

      <Controller
        control={control}
        rules={{}}
        name="email"
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{marginVertical: 5}}>
            <Text>Email</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'black',
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />
      {errors.email && (
        <Text style={{color: 'red'}}>{errors.email.message}</Text>
      )}

      <Controller
        control={control}
        rules={{}}
        name="phoneNumber"
        render={({field: {onChange, onBlur, value}}) => (
          <View style={{marginVertical: 5}}>
            <Text>Phone number</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: 'black',
                padding: 5,
                borderRadius: 5,
                marginVertical: 5,
              }}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          </View>
        )}
      />
      {errors.phoneNumber && (
        <Text style={{color: 'red'}}>{errors.phoneNumber.message}</Text>
      )}

      <Button title="Submit" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
