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
                      content="DeepLint empowers you to codify and enforce security standards and policies to secure and optimize any Cloud."/>

                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.14.0/css/all.min.css"
                      integrity="sha512-1PKOgIY59xJ8Co8+NE6FZ+LOAZKjy+KY8iq0G4B3CyeY6wYHN3yt9PW0XpSriVlkMXe40PTKnXrLnZ9+fkDaog=="
                      crossOrigin="anonymous"/>
            </Head>
            <header className={clsx('hero', styles.heroBanner)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <div>
                                <h1>Find and fix problems in any Cloud</h1>
                                <p>Use <strong>Security-as-Code</strong> to improve security, reduce cost and stay
                                    compliant in any Cloud and Infrastructure-as-Code.</p>
                                <p>DeepLint protects your cloud environments from:</p>
                                <div className="row">
                                    <div className="col">
                                        <ul>
                                            <li>Misconfigurations</li>
                                            <li>Data leakage</li>
                                            <li>IAM challenges</li>
                                            <li>Idle resources</li>
                                            <li>Compliance violations</li>
                                            <li>More</li>
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
                                <h2>Deliver Cloud Security and Governance as Code with DeepLint</h2>
                                <p>DeepLint enables you to build and enforce codified security packages per your
                                    best practices, standards, and policies to secure and optimize any Cloud in a
                                    consistent and
                                    repeatable manner. Learn more <a href="/docs">here.</a></p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-file-code fa-stack-1x fa-inverse"></i>
                                        </span>Security as Code</h3>
                                    <p>Codify security in a unified workflow - collect resources, find problems, and
                                        fix, per your best practices, standards, and policies.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-archive fa-stack-1x fa-inverse"></i>
                                        </span>Self-Contained Bundling</h3>
                                    <p>Bundle and share security required everything - scanners, rules, and actions,
                                        into a
                                        versioned and enforceable Package.
                                    </p>
                                </div>
                            </div>

                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-cubes fa-stack-1x fa-inverse"></i>
                                        </span>Pre-curated Packages</h3>
                                    <p>Elevate cloud security posture instantly with pre-curated security packages based
                                        on common industry practices.
                                    </p>
                                </div>
                            </div>

                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-cloud fa-stack-1x fa-inverse"></i>
                                        </span>Hybrid and Multi-Cloud</h3>
                                    <p>Configure and manage any security packages to check a single cloud environment or
                                        your entire hybrid or multi-cloud infrastructure.
                                    </p>
                                </div>
                            </div>
                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-shield-alt fa-stack-1x fa-inverse"></i>
                                        </span>Reliable Enforcement</h3>
                                    <p>Snapshot configurations of cloud resources for auditing and visibility. Find and
                                        fix mistakes and policy violations consistently and repeatedly.
                                    </p>
                                </div>
                            </div>

                            <div className="col col--4">
                                <div className={styles.feature}>
                                    <h3><span className={clsx('fa-stack', styles.faicon)}>
                                          <i className={clsx('fas fa-circle fa-stack-2x')}></i>
                                          <i className="fas fa-tools fa-stack-1x fa-inverse"></i>
                                        </span>Auto DevSecOps</h3>
                                    <p>Embed into DevOps pipelines and integrate with third-party security services
                                        seamlessly and effortlessly.
                                    </p>
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
