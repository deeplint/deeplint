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
    const {siteConfig = {}} = context;
    return (
        <Layout>
            <Head>
                <meta name="description"
                      content="DeepLint is an open-source Security-as-Code framework for securing and optimizing any cloud, infrastructure or services.
                      With DeepLint, you can build and enforce security workflows as code to enhance security, reduce cost and stay compliant in your cloud environments."/>
            </Head>
            <header className={clsx('hero', styles.heroBanner)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <div>
                                <h1>Prevent and fix problems in Cloud configurations</h1>
                                <p>Use <strong>Security-as-Code</strong> to secure and optimize any Cloud, infrastructure, or services.</p>
                                <p>DeepLint protects your cloud environments from:</p>
                                <div className="row">
                                    <div className="col">
                                        <ul>
                                            <li>Security threats</li>
                                            <li>Data leakage</li>
                                            <li>Compliance violations</li>
                                            <li>IAM challenges</li>
                                            <li>Idle resources</li>
                                            <li>More...</li>
                                        </ul>
                                    </div>

                                </div>

                                <div className={styles.button}>
                                    <a className="button button--primary button--lg" href="/docs">Get started</a>
                                </div>
                            </div>
                        </div>
                        <div className="col col--offset-1 col--5">
                            <div><img src="img/top_banner.svg"/></div>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <section className={styles.bgBlue}>
                    <div className={clsx('container')}>
                        <div className={clsx('row', styles.sectionHeader)}>
                            <div className="col col--12 text--center">
                                <h2>Automated cloud security and excellence with DeepLint</h2>
                                <p>DeepLint is an open-source Security-as-Code framework that enables you build, enforce and share security workflows as code to find, fix and prevent costly mistakes in any
                                    cloud configurations through entire DevOps lifecycle.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/policy.svg"/></div>
                                    <h3>Security as Code</h3>
                                    <p>Codify and automate security workflows as code - version control, peer review,
                                        enforce and share.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/file.svg"/></div>
                                    <h3>DevSecOps</h3>
                                    <p>Embed security checks into DevOps pipelines to enforce high
                                        standards without slowing down development. </p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/cloud.svg"/></div>
                                    <h3>Multi Cloud</h3>
                                    <p>Use one unified tool to check multiple cloud accounts and
                                        infrastructure as code with pluggable security packages.</p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div className={styles.feature}>
                                    <div><img src="img/trust.svg"/></div>
                                    <h3>Collaboration</h3>
                                    <p>Share your security best practices within team, or use pre-curated security packages to
                                        quickly elevate cloud security posture.</p>
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
