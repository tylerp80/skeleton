import { inputSchemaGratitudeCreate } from "@skeleton/api/schemaValidation";
import { zodSchemaToFormikValidate } from "@skeleton/lib";
import { Button } from "@skeleton/ui";
import { Formik } from "formik";
import { useState } from "react";
import { trpc } from "../utils/trpc";

type GratitudeProps = {
  page: number;
  index: number;
  id: string;
  description: string;
  createdAt: Date;
};

export const Gratitude = ({
  page,
  index,
  id,
  description,
  createdAt,
}: GratitudeProps) => {
  const utils = trpc.useContext();

  const [isEditing, setIsEditing] = useState(false);

  const updateGratitude = trpc.useMutation("gratitude.update", {
    async onSuccess(gratitude) {
      utils.setInfiniteQueryData(["gratitude.list", {}], (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        data.pages[page].data[index].description = gratitude.description;

        return {
          ...data,
          pages: data.pages,
        };
      });
      setIsEditing(false);
    },
    async onError(err) {},
  });
  const deleteGratitude = trpc.useMutation("gratitude.delete", {
    async onSuccess() {
      utils.setInfiniteQueryData(["gratitude.list", {}], (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        delete data.pages[page].data[index];

        return {
          ...data,
          pages: data.pages,
        };
      });
    },
    async onError(err) {},
  });
  
  return (
    <>
      <div className="flex flex-row py-3 space-x-3 rounded-md">
        <div className="flex flex-col w-full">
          <p className="pb-1 text-sm text-gray-500">
            {new Date(createdAt).toDateString()}
          </p>
          <p className="pb-2 text-lg font-medium text-gray-500">
            I am grateful for:
          </p>
          {isEditing ? (
            <Formik
              initialValues={{ description }}
              validationSchema={zodSchemaToFormikValidate(
                inputSchemaGratitudeCreate
              )}
              onSubmit={async (values) => {
                if (values.description === description)
                  return setIsEditing(false);

                await updateGratitude.mutate({
                  id,
                  description: values.description,
                });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="flex flex-row w-full min-h-[100px]"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                  />
                  {values.description !== "" &&
                    errors.description &&
                    touched.description &&
                    errors.description}

                  <div className="flex flex-row pt-6 space-x-3">
                    <Button type="submit" disabled={isSubmitting}>
                      Submit
                    </Button>
                    <Button
                      variant="secondary-outline"
                      disabled={isSubmitting}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          ) : (
            <p className="text-black">{description}</p>
          )}
        </div>
        {!isEditing && (
          <form id="test" method="POST">
          <div className="flex flex-row items-center justify-end space-x-3">
            <Button
              variant="secondary-outline"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
            <Button
              variant="secondary-outline"
              onClick={async () => {
                await deleteGratitude.mutate({ id });
              }}
            >
              Delete
            </Button>
            <input type="checkbox" name="select"/>
          </div>
          </form>
        )}
      </div>
      <div className="w-full h-px bg-gray-300 rounded-full" />
    </>
    
  );
};
