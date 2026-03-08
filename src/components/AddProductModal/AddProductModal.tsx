import { Modal, Input, Button } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import type { AddProductFormValues } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ open, onClose }: Props) => {
  const {
    control,
    handleSubmit,
    reset,
  } = useForm<AddProductFormValues>({
    defaultValues: { title: '', price: undefined as unknown as number, brand: '', sku: '' },
  });

  const onSubmit = (values: AddProductFormValues) => {
    console.log(values);
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
              <Input {...field} maxLength={50} showCount />
            )}
          />
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
                inputMode="numeric"
                maxLength={6}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Вендор</label>
          <Controller
            name="brand"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={20} showCount />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Артикул</label>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input {...field} maxLength={15} showCount />
            )}
          />
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
