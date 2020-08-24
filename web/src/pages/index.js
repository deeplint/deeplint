import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import Head from '@docusaurus/Head';

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout>
      <Head>
        <meta name="description"
          content="DeepLint empowers you to codify and enforce security and compliance policies to protect your Cloud
          environments and Infrastructure-as-Code templates from misconfigurations and policy violations." />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
          integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
          crossOrigin="anonymous" />
      </Head>
      <header className={clsx('hero', styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className="col col--6">
              <div>
                <h1>Find and fix problems in any Cloud</h1>
                <p>DeepLint empowers you to codify and enforce security and compliance policies to protect your Cloud
                environments and Infrastructure-as-Code templates from misconfigurations and policy violations.</p>
                <div className={styles.button}>
                  <a className="button button--primary button--lg" href="/docs">Get started</a>
                </div>
              </div>
            </div>
            <div className="col col--offset-1 col--5">
              <div><img src="img/top_banner.svg" /></div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.bgBlue}>
          <div className={clsx('container')}>
            <div className={clsx('row', styles.sectionHeader)}>
              <div className="col col--12 text--center">
                <h1>Deliver Cloud Security and Governance as Code <br /> with DeepLint</h1>
              </div>
            </div>

            <div className={clsx('row', styles.block)}>
              <div className={clsx('col col--6')}>
                <div className={styles.blocktext}>
                  <h2>Build Security as Code</h2>
                  <p>Define security and compliance policies as code to manage the full lifecycle -- collect resources
                    configurations, apply checking rules, and fix founded problems. </p>
                  <ul>
                    <li >
                      <h3><i className={clsx('far fa-check-circle')}></i> Secure any Cloud</h3>
                      <p>test</p>
                    </li>
                    <li>
                      <h3><i className={clsx('far fa-check-circle')}></i> Automate Fixes</h3>
                      <p>test</p>
                    </li>
                    <li>
                      <h3><i className={clsx('far fa-check-circle')}></i> Reuse and Share</h3>
                      <p>test</p>
                    </li>

                  </ul>
                </div>

              </div>
              <div className="col col--6">
                <div><img
                  src="https://www.terraform.io/assets/images/terraform-overview/declarative-config-files@4x-1bd3b268.png" />
                </div>
              </div>
            </div>

            <div className={clsx('row', styles.block)}>
              <div className="col col--6">
                <div><img
                  src="https://www.terraform.io/assets/images/terraform-overview/declarative-config-files@4x-1bd3b268.png" />
                </div>
              </div>

              <div className={clsx('col col--6')}>
                <div className={styles.blocktext}>
                  <h2>Automate Security with Ease</h2>
                  <p>
                    DeepLint allows you to use multiple packs to check a single cloud environment or your entire multi-cloud infrastructure. Configuration files describe to DeepLint packs needed. DeepLint orchestrates the execution-- take a snapshot of resources configurations, find and fix founded misconfigurations.
                  </p>
                  <ul>
                    <li>
                      <h4>Gain Visibility</h4>
                      <p>test</p>
                    </li>
                    <li>
                      <h4>Enable DevSecOps</h4>
                      <p>Embed into DevOps pipelines and integrate with third-party security services
                  seamlessly and effortlessly.</p>
                    </li>
                    <li>
                      <h4>Enforce Consistently and Repeatly</h4>
                      <p>test</p>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}

export default Home;
