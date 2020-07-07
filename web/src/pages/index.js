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
            <header className="hero">
                <div className="container">
                    <div className="row">
                        <div className="col col--6">
                            <div>
                                <h1>Prevent and fix problems in any Cloud</h1>
                                <p>Create, enforce and manage codified policies to enforce cloud best practices
                                    and secure cloud environments through entire DevOps lifecycle.</p>
                                <div>
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
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="col col--12 text--center">
                                <h2>Deliver Cloud Security as Code with DeepLint</h2>
                                <p>Enhance Security, Reduce Cost , Increase Performance, and Stay Compliant. Get started
                                    with free and open-sourced CLI.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col--6">
                                <div>
                                    <div><img src="img/policy.svg"/></div>
                                    <h3>Policy as Code</h3>
                                    <p>Codify cloud best practices, security and busienss rules into self- contained
                                        enforceable policies wtih real programming language. Treat policy as code -
                                        version control, pull-review and collaborate.</p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div>
                                    <div><img src="img/file.svg"/></div>
                                    <h3>Enable DevSecOps</h3>
                                    <p>Easily embed policies into your exising pipeline and enforce through entire
                                        DevOps lifecycle. Check not only live cloud environments, but also codified
                                        infrastructure as code templates.</p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div>
                                    <div><img src="img/cloud.svg"/></div>
                                    <h3>Multi Cloud</h3>
                                    <p>Check multiple accounts from different cloud providers in the same workspace.
                                        Write custom policy to support any cloud, infrastructure or services.</p>
                                </div>
                            </div>
                            <div className="col col--6">
                                <div>
                                    <div><img src="img/trust.svg"/></div>
                                    <h3>Collaboration</h3>
                                    <p>Collaborate and share your best practices as policies. Use pre-curated ones to
                                        check and improve your cloud environments agilely and confidently.</p>
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
