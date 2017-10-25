// https://www.ncbi.nlm.nih.gov/pubmed/?term=(%22eye+diseases%22%5Bmajr%5D+AND+Journal+Article%5Bptyp%5D+AND+(%222015%2F01%2F01%22%5BPDAT%5D+%3A+%222016%2F12%2F31%22%5BPDAT%5D))
// https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]&usehistory=y

function queryPubMed(diseaseName, queryType, retstart) {
  let term = `term=("`;
  term += `${diseaseName.replace(" ", "+")}"`; //disease name
  term += `%5Bmajr%5D+AND+`; //major MeSH heading
  term += `Journal+Article%5Bptyp%5D+AND+`; //journal articles only
  term += `(%222015%2F01%2F01%22%5BPDAT%5D+%3A+%222016%2F12%2F31%22%5BPDAT%5D))`; //from 2015-2016
  term += `&usehistory=y`; //enable use history
  term += `&sort=pub+date`; //sort by publication date (reverse chronological order)

  if (queryType === "getNumOfHits") {
      term += `&rettype=count`; //only return count tag with number of results
  }

  $.ajax(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&${term}`)
        .then(response => {
          if (queryType === "getNumOfHits") {
            console.log(Number(response.querySelector('Count').innerHTML))
          } else {
            console.log(response);
            let queryKey = response.querySelector('QueryKey').innerHTML;
            let webEnv = response.querySelector('WebEnv').innerHTML;
            getPubMedArticles(queryKey, webEnv, retstart);
          }
        });
}

function getPubMedArticles(queryKey, webEnv, retstart) {
  let url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`;
      url += `efetch.fcgi?`; //add efetch url
      url += `db=pubmed`;  //add database param
      url += `&query_key=${queryKey}`; //add queryKey param
      url += `&WebEnv=${webEnv}`; //add webenv param
      url += `&retmode=xml`; //add return format param
      url += `&retmax=100`; //add max num of entries param
      url += `&retstart=${retstart}`; //starting index of articles to retrieve
  $.ajax(url)
        .then(response => {
          console.log(response);
          let x2js = new X2JS();
          console.log(x2js.xml2json(response));
        })
}

// queryPubMed("cardiovascular diseases", "getArticles", 0)

// $.ajax({
//   url: `https://clinicaltrials.gov/ct2/results/download_fields?cond=cardiovascular+diseases&down_count=100&down_fmt=xml&down_flds=all&sfpd_s=01%2F01%2F2015&sfpd_e=12%2F31%2F2016&down_chunk=1`,
// })
//       .then(test => `${test}`);


// let meshDiseaseCategories = [
//   "Animal Diseases",
//   "Bacterial Infections and Mycoses",
//   "Cardiovascular Diseases",
//   "Chemically-Induced Disorders",
//   "Congenital, Hereditary, and Neonatal Diseases and Abnormalities",
//   "Digestive System Diseases",
//   "Disorders of Environmental Origin",
//   "Endocrine System Diseases",
//   "Eye Diseases",
//   "Female Urogenital Diseases and Pregnancy Complications",
//   "Hemic and Lymphatic Diseases",
//   "Immune System Diseases",
//   "Male Urogenital Diseases",
//   "Musculoskeletal Diseases",
//   "Neoplasms",
//   "Nervous System Diseases",
//   "Nutritional and Metabolic Diseases",
//   "Occupational Diseases",
//   "Otorhinolaryngologic Diseases",
//   "Parasitic Diseases",
//   "Pathological Conditions, Signs and Symptoms",
//   "Respiratory Tract Diseases",
//   "Skin and Connective Tissue Diseases",
//   "Stomatognathic Diseases",
//   "Virus Diseases",
//   "Wounds and Injuries"
// ]
