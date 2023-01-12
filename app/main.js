const { Ninetailed, selectActiveExperiments, selectExperience, selectExperienceVariant } = require("@ninetailed/experience.js");
const { isEntry, ExperienceMapper } = require("@ninetailed/experience.js-utils-contentful");
const { createClient } = require("contentful");

function createInstance(clientId, env) {
    let ninetailed = new Ninetailed(
        {
            clientId: clientId,// "9b2564dc-d607-4761-b252-47fbdbc0be20",
            environment: env,  //"development"
            preview: false
        },
        {
            locale: "en-PK",
            requestTimeout: 500
        }
    );
    return ninetailed;
}

function contentfulClient() {
    return createClient({
        space: 'svltlb1ky1ti',
        accessToken: 'qzGOB1YsWjvioEAYjOCIMvx_JNsZjsJb7EYirzCxtlo',
        environment: 'ninetailed-test'
    });
}


async function getExperiments(client) {
    const query = {
        content_type: 'nt_experience',
        'fields.nt_type': 'nt_experiment',
    };
    const experiments = await client.getEntries(query);
    let data = experiments.items.filter(x => isEntry).map((entry) => {
        return ExperienceMapper.mapExperiment(entry);
    });
    return data;
}


function experiencesMap(data) {
    return data.filter(ExperienceMapper.isExperienceEntry).map(x => {
        return ExperienceMapper.mapExperience(x);
    });
}

function activeExperiments(experiments, profile) {
    return selectActiveExperiments(experiments, profile);

}

function experienceSelect(experiences, activeExperiments, profile) {
    return selectExperience({
        experiences,
        activeExperiments,
        profile,
    });
}

function experienceVariantSelect(baseline, experience, profile) {
    return selectExperienceVariant({ baseline, experience, profile });
}

module.exports = {
    createInstance: createInstance,
    contentfulClient: contentfulClient,
    getExperiments: getExperiments,
    experiencesMap: experiencesMap,
    activeExperiments: activeExperiments,
    experienceSelect: experienceSelect,
    experienceVariantSelect: experienceVariantSelect,
};