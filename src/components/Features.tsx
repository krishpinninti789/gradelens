import { features } from "@/constants";

const Features = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powerful Features for Student Analysis
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Everything you need to transform student data into actionable
            insights
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-vprimary/10">
                    <feature.icon className="h-6 w-6 text-vprimary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.name}
                  </h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
