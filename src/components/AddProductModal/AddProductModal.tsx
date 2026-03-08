import { Modal, Input, Button, message } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useProductsStore } from '@/store/productsStore';
import type { AddProductFormValues } from '@/types';

const schema = yup.object({
  title: yup.string().max(50, 'Не более 50 символов').required('Введите наименование'),
  price: yup
    .number()
    .typeError('Введите цену')
    .positive('Цена должна быть больше 0')
    .required('Введите цену'),
  brand: yup.string().max(20, 'Не более 20 символов').default(''),
  sku: yup.string().max(15, 'Не более 15 символов').required('Введите артикул'),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ open, onClose }: Props) => {
  const addLocalProduct = useProductsStore((s) => s.addLocalProduct);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: { title: '', price: undefined as unknown as number, brand: '', sku: '' },
  });

  const onSubmit = (values: AddProductFormValues) => {
    addLocalProduct({
      id: Date.now(),
      title: values.title,
      price: values.price,
      brand: values.brand?.trim() || '—',
      sku: values.sku,
      description: '',
      category: '',
      discountPercentage: 0,
      rating: 0,
      stock: 0,
      thumbnail: '',
    });

    message.success('Товар добавлен');
    reset();
    onClose();
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title="Добавить товар"
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">Наименование</label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={50} showCount status={errors.title ? 'error' : undefined} />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Цена</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <Input
                value={field.value ?? ''}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                  field.onChange(raw === '' ? undefined : Number(raw));
                }}
                onBlur={field.onBlur}
                status={errors.price ? 'error' : undefined}
                inputMode="numeric"
                maxLength={6}
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Вендор</label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={20} showCount status={errors.brand ? 'error' : undefined} />
            )}
          />
          {errors.brand && errors.brand.message && (
            <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Артикул</label>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={15} showCount status={errors.sku ? 'error' : undefined} />
            )}
          />
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button onClick={handleCancel}>Отмена</Button>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </div>
      </form>
    </Modal>
  );
};
