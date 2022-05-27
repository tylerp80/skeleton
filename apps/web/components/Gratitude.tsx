import { trpc } from "../utils/trpc";
import { inputSchemaGratitudeCreate } from "@skeleton/api/schemaValidation";
import { zodSchemaToFormikValidate } from "@skeleton/lib";
import { Button } from "@skeleton/ui";
import { Formik } from "formik";
import { useState } from "react";

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
      <div className="flex flex-row space-x-3 py-3 rounded-md">
        <div className="flex flex-col w-full">
          <p className="text-sm pb-1 text-gray-500">
            {new Date(createdAt).toDateString()}
          </p>
          <p className="text-gray-500 pb-2 font-medium text-lg">
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
          <div className="flex flex-row space-x-3 items-center justify-end">
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
          </div>
        )}
      </div>
      <div className="bg-gray-300 h-px w-full rounded-full" />
    </>
  );
};
