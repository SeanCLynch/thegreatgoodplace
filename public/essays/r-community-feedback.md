Research Review - How Community Feedback Shapes User Behavior
---
		
[Link to Paper](http://cs.stanford.edu/people/jure/pubs/disqus-icwsm14.pdf?dansays=itisok)  

**The Gist**

Evaluations create complex social feedback effects. This paper explored how rating content affects the authors future behavior. It found that negative feedback produced more negative behavior (more low quality content, reciprocal negative feedback) from the author while positive feedback seems to have little effect.

**General**

While reading this paper (which I suggest you do), I had one question I couldn't shake: are feedback systems actually beneficial for the community? And the authors apparently had the same question, though their specific findings indicated that up/down voting of content primarily spreads negativity throughout a community. So my brain jumped to the question has binary voting failed? What does the next system of curating content look like? 

**Success Metrics**

Their method of measuring how well a post did was lacking in my opinion. A positively reviewed post (numerically) is not necessarily a positive for the community. This might be attributed to the idea that upvoting currently represents agreement or like of content, when it should ideally indicate a positive contribution (and lets not even get started on trolls or gamification of content). So, when this paper uses the number of positive votes divided by the number of total votes to create a metric for measuring the success of a post, they failed to account for what a vote actually means. Although it was pretty cool that they crowdsourced affirmation of this metric through Amazon's mechanical turk. Their metric represents how well liked a post is, not how much it contributes to the community. The difference is subtle, but very important (and admittedly kind of irrelevant when talking about contributors motivations…). 

A good example is the difference between a meme and original content. Which is better for the community? There is something positive to be said for both in different contexts. However witty or novel contributions are part of what makes a community have strong conversations (and identity) and a playful mood. Rehashing of ideas is okay every now and again, but they induce repetitive, braindead and monotonous conversation over time. The Lego community is one of my favorites for this reason. There is always new contributions generating new conversation about techniques or new blocks. And old content is brought up now and again, but is generally avoided - thus keeping the community fresh and forward-focused (which IMO is a positive metric for a community). A metric like voting, especially with large communities, simply cannot be solely relied upon to accurately indicate the quality (positive contribution, not popularity) of a post.  

**Feedback Responses**

Another observation from the paper I found pretty interesting was the response pattern of users. They found that those who received negative feedback clearly responded by posting more and voting negatively more. While those who received positive feedback didn't change their behavior that much. (There is also a cool chart about how writing is affected by feedback on page 6). In some cases users who got positive feedback gave more positive feedback to others, while in other cases, they became more critical, voting negatively more. Perhaps how any users content is received is less relevant than their personalities? Some will just downvote and post bad content, while others will think reasonably and try to post good content.  

**Voting Networks**

There was also a really cool discussion on voting networks/graphs. They looked at structural theory taking upvoters as one group and downvoters as another. They found that when the votes are evenly split the network is most polarized, there are two large, separate groups that each vote amongst themselves and against the other group. Furthermore, this is when the number of edges between the two groups is the smallest. It was a cool way of describing uncoordinated crowd mentalities in online communities.   

**Discussion Section**

The discussion session brought up some interesting thoughts and questions that I though I would share here:  

Feedback is not that discouraging, not like an electric shock would be - therefore conventional psychology might not be appropriate. 

They discarded flame wars as an explanation of voting patterns because the data-set was very large and they used many different threads to cross examine a single user. 

The idea of voting vs only up votes vs comment feedback needs to be explored, there would clearly be differences in how perceptions would change. There might also be further research to be done about authority in feedback, do some votes mean more than others? 

And finally, they discussed online norm enforcement. How much is the reaction to feedback dependent on a users desires to join (or leave) group? This also might cover the role of trolls, who might be interested in purely messing with online norms. 

**Thoughts**

This was very interesting paper. It stuck me as very modern when reading it - including techniques like crowdsourcing, machine learning, and graph theory.This topic is relevant to how we interact with the web today since so many sites employ voting mechanisms. As I stated at the beginning, I am still curious about what an ideal feedback system would look like if voting systems are not ideal. When I think about it, perhaps community does not need voting. Conversation should be the main activity, not content curation or voting. 

