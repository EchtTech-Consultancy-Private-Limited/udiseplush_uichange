import React from 'react';
import {useTranslation} from "react-i18next";

export default function HelpLineNumber() {
    const { t } = useTranslation();
    return (
        <section className="bg-grey ptb-60" id='content'>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="heading-sm">{t("helpline_numbers")}</h2>
                        <p className="desc-black">
                            {t("helpline_page_description")}
                        </p>

                        <div className="screentable table-responsive mt-2">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Number</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Customer Support</td>
                                    <td>1-800-123-4567</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Technical Support</td>
                                    <td>1-800-987-6543</td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Emergency Services</td>
                                    <td>1-800-555-7890</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
