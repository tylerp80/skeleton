import { inputSchemaGratitudeCreate } from "@skeleton/api/schemaValidation";
import { zodSchemaToFormikValidate } from "@skeleton/lib";
import { Button } from "@skeleton/ui";
import { Formik } from "formik";
import { Gratitude } from "../components/Gratitude";
import { trpc } from "../utils/trpc";
import { NextPageWithLayout } from "./_app";

const IndexPage: NextPageWithLayout = () => {
  const utils = trpc.useContext();

  const { hasNextPage, data, isLoading, fetchNextPage } = trpc.useInfiniteQuery(
    ["gratitude.list", {}],
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const createGratitude = trpc.useMutation("gratitude.create", {
    async onSuccess(gratitude) {
      utils.setInfiniteQueryData(["gratitude.list", {}], (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
  

        return {
          ...data,
          pages: data.pages.map((page, index) =>
            index === 0 ? { ...page, data: [gratitude, ...page.data] } : page
          ),
        };
      });
    },
    async onError(err) {},
  });

  const deleteGratitudes = trpc.useMutation("gratitude.deleteMany", {
    async onSuccess(gratitude) {
      utils.setInfiniteQueryData(["gratitude.list", {}], (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
  

        return {
          ...data,
          pages: data.pages.map((page, index) =>
            index === 0 ? { ...page, data: [...gratitude, ...page.data] } : page
          ),
        };
      });
    },
    async onError(err) {},
  });

  return (
    <div>
      <div className="flex flex-col">
        <Formik
          initialValues={{ description: "" }}
          validationSchema={zodSchemaToFormikValidate(
            inputSchemaGratitudeCreate
          )}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            await createGratitude.mutate({ description: values.description });
            resetForm();
            setSubmitting(false);
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
              <p className="pb-3 text-gray-500">Create a gratitude entry:
              </p>
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

              <div className="flex flex-row pt-6">
                <Button type="submit" disabled={isSubmitting}>
                  Create
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
      <div className="flex flex-row items-center justify-end space-x-3">
      <Button
            >
              Delete Selected
            </Button>
            </div>
            
      <div className="bg-gray-300 h-px w-full rounded-full mt-6 mb-3" />
      <div className="flex flex-col space-y-3">
        {!isLoading &&
          data &&
          data.pages &&
          data.pages.map((pages, pageIndex) =>
            pages.data.map(
              (gratitude, index) =>
                gratitude && (
                  <Gratitude
                    key={index}
                    page={pageIndex}
                    index={index}
                    id={gratitude.id}
                    description={gratitude.description}
                    createdAt={gratitude.createdAt}

                  />
                )
            )
          )}
      </div>
      <div className="flex flex-row items-center justify-center pt-6">
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()}>Load more</Button>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
