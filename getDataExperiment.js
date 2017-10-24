// https://www.ncbi.nlm.nih.gov/pubmed/?term=(%22eye+diseases%22%5Bmajr%5D+AND+Journal+Article%5Bptyp%5D+AND+(%222015%2F01%2F01%22%5BPDAT%5D+%3A+%222016%2F12%2F31%22%5BPDAT%5D))
// https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=asthma[mesh]+AND+leukotrienes[mesh]+AND+2009[pdat]&usehistory=y

function queryPubMed(diseaseName){
  let db = `pubmed`;
  let term = `term=("`;
  term += `${diseaseName.replace(" ", "+")}"`; //disease name
  term += `%5Bmajr%5D+AND+`; //major MeSH heading
  term += `Journal+Article%5Bptyp%5D+AND+`; //journal articles only
  term += `(%222015%2F01%2F01%22%5BPDAT%5D+%3A+%222016%2F12%2F31%22%5BPDAT%5D))`; //from 2015-2016
  term += `&usehistory=y`; //enable use history

  let queryKey, webEnv;

  $.ajax(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&${term}`)
        .then(response => {
          queryKey = response.querySelector('QueryKey').innerHTML;
          webEnv = response.querySelector('WebEnv').innerHTML;
        })
        .done(() => getArticles());

  function getArticles() {
    $.ajax(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${queryKey}&WebEnv=${webEnv}&retmode=xml&retmax=5`)
          .then(response => {
            console.log(response);
            let x2js = new X2JS();
            console.log(x2js.xml2json(response));
          })
  }

}

getJournalArticles("cardiovascular diseases")

//animal diseases
//
