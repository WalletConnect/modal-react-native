const {
  createRunOncePlugin,
  withAndroidManifest,
} = require('@expo/config-plugins');

const withCustomQueries = (config, params) => {
  return withAndroidManifest(config, (config) => {
    const queries = config.modResults.manifest.queries;

    const packages = params.map((p) => {
      return { $: { 'android:name': p } };
    });

    if (queries.length === 0) queries.push({});

    queries[0] = {
      ...{
        package: packages,
      },
      ...queries[0],
    };
    return config;
  });
};

module.exports = createRunOncePlugin(withCustomQueries, 'withCustomQueries');
