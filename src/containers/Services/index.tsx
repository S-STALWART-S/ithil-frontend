import { services } from "@/data/services";

import ServiceCard from "./ServiceCard";

const ServicesPage = () => {
  return (
    <div className="grid gap-6 mg:gap-6 md:grid-cols-2 lg:grid-cols-3 rounded-xl">
      {services
        .filter((service) => service.url !== "/fixed-yield")
        .map((item, index) => (
          <ServiceCard
            key={item.name + index}
            assets={item.tokens}
            description={item.description}
            to={item.url}
            hasIndex={item.hasIndex}
            multiplier={item.apyRange}
            label={item.label}
            name={item.name}
            apy={`${item.bestApy}%`}
          />
        ))}
    </div>
  );
};

export default ServicesPage;
