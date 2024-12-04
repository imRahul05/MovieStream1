interface StreamingInfoProps {
  watchProviders: MovieDetails['watchProviders'];
}

export default function StreamingInfo({ watchProviders }: StreamingInfoProps) {
  if (!watchProviders) {
    return (
      <div className="text-white/60">
        <p>No streaming information available</p>
      </div>
    );
  }

  const { flatrate, rent, buy } = watchProviders;

  const renderProviders = (
    providers: { provider_id: number; provider_name: string; logo_path: string }[] | undefined,
    title: string
  ) => {
    if (!providers?.length) return null;

    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-lg font-medium text-white mb-3">{title}</h4>
        <div className="flex flex-wrap gap-4">
          {providers.map((provider) => (
            <div
              key={provider.provider_id}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-6 h-6 rounded"
              />
              <span className="text-white">{provider.provider_name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-white mb-4">Where to Watch</h3>
      {renderProviders(flatrate, "Stream")}
      {renderProviders(rent, "Rent")}
      {renderProviders(buy, "Buy")}
    </div>
  );
}