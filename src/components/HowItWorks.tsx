import { steps } from "@/constants";

const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How GradeLens Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Simple 4-step process to transform student reports into actionable
            insights
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.name} className="relative text-center">
                <div className="flex flex-col items-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-vprimary text-white text-xl font-bold">
                    {step.step}
                  </div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-vprimary/10">
                    <step.icon className="h-6 w-6 text-vprimary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <div className="h-0.5 bg-vprimary/20 w-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
